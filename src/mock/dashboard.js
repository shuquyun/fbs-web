import { color } from '../utils/theme'

const Mock = require('mockjs')
const config = require('../utils/config')

const { mockApiPrefix } = config

const Dashboard = Mock.mock({
  'sales|10': [
    {
      'name|+1': 2008,
      'Amount|200-500': 1,
      'Number|180-400': 1,
    },
  ],
  numbers: [
    {
      icon: 'bell',
      color: color.green,
      title: '我的设备',
      number: 148,
    }, {
      icon: 'bank',
      color: color.purple,
      title: '累计营业额',
      number: 1377,
    }, {
      icon: 'pay-circle-o',
      color: color.blue,
      title: '累计订单数',
      number: 387,
    }, {
      icon: 'sync',
      color: color.red,
      title: '退款订单数',
      number: 0,
    },
  ],
})

module.exports = {
  [`GET ${mockApiPrefix}/dashboard`] (req, res) {
    res.json(Dashboard)
  },
}
