import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {Row, Col, Card,Button, Carousel, Icon} from 'antd'
import { Link } from 'dva/router'
import CountUp from 'react-countup'
import {NumberCard, Sales, SalesNumber} from './components'
import {color} from 'utils'
import OrderAxisChart from './components/orderAxisChart'
import PriceChart from './components/priceChart'
import {amountFormat} from '../../utils'

import styles from './index.less'


function Dashboard({dashboard}) {
  const {
    dateList,
    feeList,
    amountList,

    totalDeviceAmount,
    onlineDeviceAmount,
    exceptionDeviceAmount,

    totalFee,
    todayTotalFee,
    yesterdayTotalFee,
    todayRefundFee,

    totalAmount,
    todayAmount,
    yesterdayAmount,
    todayRefundAmount,

    lastWeekTotalFee,
    weekTotalFee,
    todaySettleFee,

    todayProfitFee,
    totalProfitFee,
    totalProfitAmount,

    totalFeeAlipay,
    totalFeeWechat,
    totalFeeCash,

    feeListAlipay,
    feeListWechat,
    feeListCash,

    noticeList,
  } = dashboard

  const alipayColor = "#3a5b7e"
  const wechatColor = "#82c0fd"
  const cashColor = "#c3e5fe"

  const chartProps = {
    alipayColor,
    wechatColor,
    cashColor,
    dateList,
    //金额分转元
    feeList: feeList.map(fee=>{
      return amountFormat(fee)
    }),
    feeListAlipay: feeListAlipay.map(fee=>{
      return amountFormat(fee)
    }),
    feeListWechat: feeListWechat.map(fee=>{
      return amountFormat(fee)
    }),
    feeListCash: feeListCash.map(fee=>{
      return amountFormat(fee)
    }),
    amountList,
  }
  const priceProps = {
    totalFeeAlipay: amountFormat(totalFeeAlipay),
    totalFeeWechat: amountFormat(totalFeeWechat),
    totalFeeCash: amountFormat(totalFeeCash),
    alipayColor,
    wechatColor,
    cashColor,
  }

  const cardSpan= {
    lg:6,
    md:6,
    xs:12,
  }

  return (
    <Row gutter={24}>
      {noticeList&&noticeList.length>0&&
      <Col span={24} style={{ marginBottom: '-10px'}}>
        <Card bordered={false} bodyStyle={{padding: 10}}>
          <Carousel autoplay={true} autoplaySpeed={5000} dots={false} >
            {noticeList.map((notice)=>{return <Col><Icon type="sound" style={{ fontSize: 16, }} />：{notice.content}</Col>})  }
          </Carousel>

        </Card>
      </Col>
      }
      <Col {...cardSpan} className={styles.numberCard}>
        <Card bordered={false} title="我的设备（台）" style={{minHeight: 138,}} extra={<a href="/device/list">详情</a>}>
          <div style={{height:48,}}>
            <Col style={{ fontSize: 30}}>
              <CountUp
                start={0}
                end={totalDeviceAmount}
                duration={2.75}
                decimals={0}
                useEasings
                useGrouping
                separator=","
              />
            </Col>
          </div>
          <div style={{height: 20,fontSize: 12}}>
            <Col>
              在线：<a href='/device/list?status=1'>{onlineDeviceAmount}</a>   |   异常：<a href='/device/list?status=-1' style={{color: '#fd6739'}}>{exceptionDeviceAmount}</a>
            </Col>
          </div>

        </Card>
      </Col>
      <Col {...cardSpan} className={styles.numberCard}>
        <Card bordered={false} title="今日收益额（元）" style={{minHeight: 138}}>
          <Col style={{height:48,fontSize: 30}}>
            <CountUp
              start={0}
              end={amountFormat(todayProfitFee)}
              duration={2.75}
              decimals={2}
              useEasings
              useGrouping
              separator=","
            /> </Col>
          <Col style={{height: 20,fontSize: 12}}>
            累计收益额：{totalProfitFee}
          </Col>
        </Card>
      </Col>
      <Col {...cardSpan} className={styles.numberCard}>
        <Card bordered={false} title="今日营业额（元）" style={{minHeight: 138}}>
          <Col style={{height:48,fontSize: 30}}>
            <CountUp
              start={0}
              end={amountFormat(todayTotalFee)}
              duration={2.75}
              decimals={2}
              useEasings
              useGrouping
              separator=","
            /> </Col>
          <Col style={{height: 20,fontSize: 12}}>
            累计营业额：{amountFormat(totalFee)}
          </Col>
        </Card>
      </Col>
      <Col {...cardSpan} className={styles.numberCard}>
        <Card bordered={false} title="今日订单数（笔）" style={{minHeight: 138}}>
          <Col style={{height:48,fontSize: 30}}>
            <CountUp
              start={0}
              end={todayAmount}
              duration={2.75}
              decimals={0}
              useEasings
              useGrouping
              separator=","
            /></Col>
          <Col style={{height: 20,fontSize: 12}}>
            累计订单数：{totalAmount}
          </Col>
        </Card>
      </Col>

      <Col span={24}>
        <Card>
          <Col span={18}>
            <OrderAxisChart {...chartProps}/>
          </Col>
          <Col span={6}>
            <PriceChart {...priceProps}/>
            <Col>上周交易：{amountFormat(lastWeekTotalFee)} 元</Col>
            <Col>本周交易：{amountFormat(weekTotalFee)} 元</Col>
            <Col>今日交易：{amountFormat(todayTotalFee)} 元</Col>
          </Col>
        </Card>


      </Col>
    </Row>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
}

export default connect(({dashboard}) => ({dashboard}))(Dashboard)
