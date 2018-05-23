import config from './config'
import request from './request'
import classnames from 'classnames'
import {color} from './theme'
import lodash from 'lodash'
import styles from './index.less'
import moment from 'moment'


// 连字符转驼峰
String.prototype.hyphenToHump = function () {
  return this.replace(/-(\w)/g, (...args) => {
    return args[1].toUpperCase()
  })
}

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
  return this.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 日期格式化
Date.prototype.format = function (format) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length))
    }
  }
  return format
}

//格式化日期,如果为空则返回空
const formatDate = (date,str)=>{
  if(!date){
    return ""
  }
  return moment(date).format(str?str:"YYYY-MM-DD HH:mm:ss")
}


/**
 * @param   {String}
 * @return  {String}
 */

const queryURL = (name) => {
  let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  const item = array.filter(_ => _[keyAlias] === key)
  if (item.length) {
    return item[0]
  }
  return null
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = lodash.cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}


/**
 * 金额格式化(分转元)
 * @param key
 * @returns {number}
 */
const amountFormat = (key) => {
  if(!key){
    return 0
  }else{
    return key / 100
  }
}

/**
 * 数字格式化（元转分）
 * @param key
 * @returns {number}
 */
const numberFormat = (key) => {
  if(!key){
    return 0
  }else{
    return key * 100
  }
}



/**
 * 运营商状态
 * @param key
 * @returns {XML}
 */
const bizStatusItem = (key) => {
  switch (key) {
    case -1:
      return <label >禁用</label>
    case 0:
      return <label >未审核</label>
    case 1:
      return <label >审核通过</label>
    case 2:
      return <label >审核不通过</label>
    case 3:
      return <label >黑名单</label>
  }
}

/**
 * 代理商层级
 * @param key
 * @returns {XML}
 */
const agentLevelItem = (key) => {
  switch (key) {
    case 1:
      return <label >合伙人</label>
    case 2:
      return <label >全国代理</label>
    case 3:
      return <label >省级代理</label>
    case 4:
      return <label >城市代理</label>
    case 5:
      return <label >区域代理</label>
  }
}

/**
 * 代理商状态
 * @param key
 * @returns {XML}
 */
const agentStatus = (key) => {
  switch (key) {
    case -1:
      return <label >禁用</label>
    case 0:
      return <label >未审核</label>
    case 1:
      return <label >审核通过</label>
    case 2:
      return <label >审核不通过</label>
    case 3:
      return <label >黑名单</label>
  }
}

/**
 * 管理员状态
 * @param key
 * @returns {XML}
 */
const adminStatus = (key) => {
  switch (key) {
    case -1:
      return <label >禁用</label>
    case 0:
      return <label >未审核</label>
    case 1:
      return <label >审核通过</label>
    case 2:
      return <label >审核不通过</label>
    case 3:
      return <label >黑名单</label>
  }
}


/**
 * 银行卡状态
 * @param key
 * @returns {XML}
 */
const bankCardStatus = (key) => {
  switch (key) {
    case 0:
      return <label >未审核</label>
    case 1:
      return <label >已审核</label>
    case 2:
      return <label >已驳回</label>
  }
}

/**
 * 分润订单类型
 * @param key
 * @returns {XML}
 */
const profitOrderType = (key) => {
  switch (key) {
    case 1:
      return <label >订单分润</label>
    case 2:
      return <label >广告分润</label>
  }
}

/**
 * 分润订单状态
 * @param key
 * @returns {XML}
 */
const profitOrderStatus = (key) => {
  switch (key) {
    case 0:
      return <label >创建</label>
    case 1:
      return <label >结算</label>
    case 2:
      return <label >失败</label>
    case -1:
      return <label  >取消</label>
  }
}

/**
 * 提现订单状态
 * @param key
 * @returns {XML}
 */
const withdrawOrderStatus = (key) => {
  switch (key) {
    case 0:
      return <label >创建</label>
    case 1:
      return <label >已确认</label>
    case 2:
      return <label >提交代付</label>
    case 3:
      return <label >已结算</label>
    case 4:
      return <label >代付失败</label>
    case 5:
      return <label >审核通过</label>
    case 6:
      return <label >审核不通过</label>
    case 7:
      return <label >需要人工对账</label>
  }
}

/**
 * 订单付款类型
 * @param key
 * @returns {XML}
 */
const payOrderPriceType = (key) => {
  switch (key) {
    case 1:
      return <label  >官方价格</label>
    case 2:
      return <label  >第三方价格</label>
    case 3:
      return <label  >混合价格</label>
  }
}

/**
 * 支付方式
 * @param key
 * @returns {XML}
 */
const payOrderPayType = (key) => {
  switch (key) {
    case 1:
      return <label  >支付宝</label>
    case 2:
      return <label  >微信</label>
    case 3:
      return <label  >现金</label>
  }
}

/**
 * 支付订单状态
 * @param key
 * @returns {XML}
 */
const payOrderStatus = (key) => {
  switch (key) {
    case 0:
      return <label  >未支付</label>
    case 1:
      return <label  >支付成功</label>
  }
}

/**
 * 退款订单状态
 * @param key
 * @returns {XML}
 */
const refundOrderStatus = (key) => {
  switch (key) {
    case 1:
      return <label  >待退款</label>
    case 2:
      return <label  >退款成功</label>
    case 3:
      return <label  >退款失败</label>
    case -1:
      return <label  >关闭订单</label>
    default:
      return <label  >待退款</label>
  }
}


/**
 * 用户状态
 * @param key
 * @returns {XML}
 */
const userStatus = (key) => {
  switch (key) {
    case 1:
      return <label >正常</label>
    case 0:
      return <label >待审核</label>
    case -1:
      return <label >禁用</label>
  }
}

/**
 * 用户消息类型
 * @param key
 * @returns {XML}
 */
const userMessageType = (key) => {
  switch (key) {
    case 1:
      return <label >系统消息</label>
    case 2:
      return <label >站内消息</label>
  }
}


/**
 * 设备状态
 * @param key
 * @returns {XML}
 */
const deviceStatus = (key)=>{
  switch (key) {
    case 1:
      return <label >在线</label>
    case 0:
      return <label >预上线</label>
    case -1:
      return <label >离线</label>
    case -2:
      return <label >报废</label>
  }
}

/**
 * 设备日志类型
 * @param key
 * @returns {XML}
 */
const deviceLogType = (key)=>{
  switch (key) {
    case 1:
      return <label >缺货</label>
    case 2:
      return <label >掉线</label>
    case 3:
      return <label >出货异常</label>
  }
}

/**
 * 设备分配状态
 * @param key
 * @returns {XML}
 */
const deviceRelationStatus = (key)=>{
  switch (key) {
    case 0:
      return <label >未分配</label>
    case 1:
      return <label >已分配</label>
  }
}


module.exports = {
  config,
  request,
  color,
  classnames,
  formatDate,
  queryURL,
  queryArray,
  arrayToTree,
  amountFormat,
  numberFormat,
  bizStatusItem,
  agentLevelItem,
  agentStatus,
  adminStatus,
  bankCardStatus,
  profitOrderType,
  profitOrderStatus,
  withdrawOrderStatus,
  payOrderPriceType,
  payOrderPayType,
  payOrderStatus,
  refundOrderStatus,
  userStatus,
  userMessageType,
  deviceStatus,
  deviceLogType,
  deviceRelationStatus,
}
