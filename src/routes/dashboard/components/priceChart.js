import React from 'react'
import ReactEcharts from 'echarts-for-react'
import PropTypes from 'prop-types'

class PriceChart extends React.Component{
  constructor (props) {
    super(props)

    this.state = {

    }
  }
  componentDidMount () {

  }
  componentWillUnmount () {

  }





  render () {
    const {
      alipayColor,
      wechatColor,
      cashColor,
      totalFeeAlipay,
      totalFeeWechat,
      totalFeeCash,
    } =this.props

    const option = {
      title : {
        text: '累计营收',
        x:'left',
        textStyle: {
          fontSize: 15,
        }
      },
      tooltip : {
        trigger: 'item',
      },
      legend: {
        // orient: 'vertical',
        left: 'right',
        data: ['支付宝', '微信', '现金'],
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 10,
        }
      },
      series : [
        {
          // name: '支付来源',
          type: 'pie',
          radius : ['30%', '70%'],
          // center: ['50%', '60%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '12',
                fontWeight: 'bold'
              }
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data:[
            {
              value: totalFeeAlipay,
              name:'支付宝',
              itemStyle:{
                normal:{
                  color: alipayColor,
                },
              },
            },
            {
              value: totalFeeWechat,
              name:'微信',
              itemStyle:{
                normal:{
                  color: wechatColor,
                },
              },
            },
            {
              value: totalFeeCash,
              name:'现金',
              itemStyle:{
                normal:{
                  color: cashColor,
                },
              },
            },
          ],
          itemStyle: {
            normal:{},
            emphasis: {
              shadowBlur: 2,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };


    return (
      <div style={{ height: 250 }}>
          <ReactEcharts ref="echarts_react"
                        option={option}
                        style={{ height: '100%' }}

          />
      </div>
    )
  }
}

export default PriceChart
