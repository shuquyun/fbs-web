import React from 'react'
import ReactEcharts from 'echarts-for-react'
import PropTypes from 'prop-types'

class OrderAxisChart extends React.Component{
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
      dateList= [],
      feeList=[],
      amountList=[],
      feeListAlipay=[],
      feeListWechat=[],
      feeListCash=[],
    } =this.props

    const option = {
      title: {
        text: '交易变化趋势',
        textStyle: {
          fontSize: 15,
        }
      },
      tooltip: {
        trigger: 'axis',
        // axisPointer: {
        //   type: 'cross',
        //   crossStyle: {
        //     color: '#999'
        //   }
        // }
      },
      legend: {
        data:['支付宝','微信','现金','订单量'],
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 10,
        }
      },
      xAxis: [
        {
          type: 'category',
          data: dateList,
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '交易金额（元）',
          min: 0,
          // max: 250,
          // interval: 50,
          axisLabel: {
            formatter: '{value}'
          },
          splitLine: {
            show: false
          },
          splitNumber: 10,
        },
        {
          type: 'value',
          name: '交易笔数（笔）',
          min: 0,
          // max: 25,
          // interval: 30,
          axisLabel: {
            formatter: '{value}'
          },
          splitLine: {
            show: false
          },
          splitNumber: 10,
        }
      ],
      series: [
        {
          name:'支付宝',
          type:'bar',
          data: feeListAlipay,
          // barWidth: 40,
          barCategoryGap: '60%',
          itemStyle:{
            normal:{
              color: alipayColor,
              position: 'insideRight'
            },
          },
          stack: 'feeList'

        },
        {
          name:'微信',
          type:'bar',
          data: feeListWechat,
          // barWidth: 40,
          barCategoryGap: '60%',
          itemStyle:{
            normal:{
              color: wechatColor,
              position: 'insideRight'
            },
          },
          stack: 'feeList'

        },
        {
          name:'现金',
          type:'bar',
          data: feeListCash,
          // barWidth: 40,
          barCategoryGap: '60%',
          itemStyle:{
            normal:{
              color: cashColor,
              position: 'insideRight'
            },
          },
          stack: 'feeList'

        },
        {
          name:'订单量',
          type:'line',
          yAxisIndex: 1,
          data: amountList,
          itemStyle:{
            normal:{
              color: '#fe9148'
            },
          }
        }
      ]
    };


    return (
      <div style={{ height: 400 }}>
          <ReactEcharts ref="echarts_react"
                        option={option}
                        style={{ height: '100%' }}

          />
      </div>
    )
  }
}

export default OrderAxisChart
