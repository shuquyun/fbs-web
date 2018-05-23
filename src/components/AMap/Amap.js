import React from 'react'
import PropTypes from 'prop-types'
import { Map,Marker,Circle } from 'react-amap';

class Amap extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      amapkey: this.props.amapkey ? this.props.amapkey : '7a5d28e11f78ec9bc4e7c21170cfe007',
      callback: this.props.getAddressDetailAndPosition,
      draggable: this.props.draggable,
    }

    this.mapPlugins = [
      {
        name: 'ToolBar',
        options: {
          visible: true, // 动态改变控件的可视状态，默认为 true
          onCreated(ins){
          },
          locate: false,
        }
      },
    ];

  }


  render() {

    let _this = this;
    const buildAddress = (lng,lat)=>{
      if(lng&&lat){
        _this.geocoder && _this.geocoder.getAddress([lng, lat], (status, result) => {
          if (status === 'complete'){
            //返回成功
            const addressComponent = result.regeocode.addressComponent
            const addressDetail = `${addressComponent.township?addressComponent.township:''}${addressComponent.street?addressComponent.street:''}${addressComponent.streetNumber?addressComponent.streetNumber:''}${addressComponent.neighborhood?addressComponent.neighborhood:''}${addressComponent.building?addressComponent.building:''}`
            if(this.state.callback){
              this.state.callback({lng,lat,},addressDetail)
            }
          } else {
            //返回失败
          }
        })
      }

    }

    const renderLocation = (address,map)=>{
      if(address){
        _this.geocoder && _this.geocoder.getLocation(address, (status, result) => {
          if (status === 'complete'&& result.info === 'OK'){
            //返回成功
            const location = result.geocodes[0].location
            if(location){
              map.setCenter([location.lng, location.lat])
            }
          } else {
            //返回失败
          }
        })
      }

    }

    const mapProps={
      zoom:11,
      events:{
        //创建完成回调
        created: (map) => {
          AMap.plugin('AMap.Geocoder',() => {
            _this.geocoder = new AMap.Geocoder({
              // city: "010"//城市，默认：“全国”
            });
          })

        },
      },
    }
    let markerProps = {
      draggable: this.state.draggable,
      events:{
        //创建完成回调
        created: (instance) => {
          if(this.props.lng&&this.props.lat){
            //以坐标为准
          }else{
            const lnglat = instance.getPosition()
            buildAddress(lnglat.lng, lnglat.lat)
          }

        },
        //标点移动结束回调
        dragend: (e) => {
          const lnglat = e.lnglat
          buildAddress(lnglat.lng, lnglat.lat)
        },
      },
    }

    if(this.props.lng&&this.props.lat){
      mapProps.center = {longitude:this.props.lng, latitude:this.props.lat}
      markerProps.position = {longitude:this.props.lng, latitude:this.props.lat}
    }
    return (
      <Map amapkey={this.state.amapKey} {...mapProps} plugins={this.mapPlugins}>
        <Marker {...markerProps}/>
      </Map>
    );
  }
}

Amap.propTypes = {

}

export default Amap
