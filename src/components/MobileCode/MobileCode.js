import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd';

class MobileCode extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      loading: false,
      callback: props.sendMsg,
      countdown: 60,
    }
  }
  runCountdown (){
    this.timer = setTimeout(
      () => {
        if(this.props.mobileCodeButtonDisable){
          if(this.state.countdown>0){
            this.setState({countdown:(this.state.countdown-1)})
          }else{
            this.props.enableMobileCodeButton()
            this.setState({countdown:(60)})
          }

        }
        this.runCountdown()
      },
      1000
    )

  }
  componentDidMount() {
    this.timer && clearTimeout(this.timer);
    this.runCountdown()
  }
  componentWillUnmount() {
    // 如果存在this.timer，则使用clearTimeout清空。
    // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
    this.timer && clearTimeout(this.timer);
  }
  sendMobileCode =()=>{
    this.setState({ loading: true });
    if(this.callback){
      callback()
    }
  }

  render() {
    return (
        <Button size="large" loading={this.props.loading}
                onClick={this.props.sendMobileCode}
                disabled={this.props.mobileCodeButtonDisable}>{this.props.mobileCodeButtonDisable?`${this.state.countdown}s后可重新发送`:'获取手机验证码'}</Button>
    );
  }
}

MobileCode.propTypes = {

}

export default MobileCode
