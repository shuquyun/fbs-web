import {query} from '../services/dashboard'


export default {
  namespace: 'dashboard',
  state: {
    lastWeekTotalFee: 0,
    totalDeviceAmount: 0,
    onlineDeviceAmount: 0,
    weekTotalFee: 0,
    todaySettleFee: 0,
    todayAmount: 0,
    totalFee: 0,
    exceptionDeviceAmount: 0,
    todayTotalFee: 0,
    todayProfitFee: 0,
    totalProfitFee: 0,
    totalProfitAmount: 0,

    totalFeeAlipay: 0,
    totalFeeWechat: 0,
    totalFeeCash: 0,

    noticeList: [],
    dateList: [],
    feeList: [],
    amountList: [],

    feeListAlipay: [0, 0, 0, 0, 0, 0, 0],
    feeListWechat: [0, 0, 0, 0, 0, 0, 0],
    feeListCash: [0, 0, 0, 0, 0, 0, 0],

  },
  subscriptions: {
    setup ({dispatch}) {
      dispatch({type: 'query'})
    },
  },
  effects: {
    * query ({payload,}, {call, put}) {
      const data = yield call(query, payload)
      if(data){
        yield put({type: 'querySuccess', payload: {...data}})
      }

    },
  },
  reducers: {
    querySuccess (state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
