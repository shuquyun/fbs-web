import { resetpwd,sendMsg } from '../services/resetpwd'
import { routerRedux } from 'dva/router'
import { queryURL } from 'utils'
import moment from 'moment'
import { message } from 'antd';

export default {
  namespace: 'resetpwd',
  state: {
    resetpwdLoading: false,
    ctoken:  "maijia:"+moment()+Math.random(),
    mobile: null,
    mobileCodeLoding: false,
    mobileCodeDisabled: false,
    mobileCodeButtonDisable: false,
    isAgree: false,
  },
  effects: {
    *resetpwd ({
      payload,
    }, { put, call }) {
      yield put({ type: 'showresetpwdLoading' })
      let data
      try {
        data = yield call(resetpwd, payload)
      }catch (e){
        //异常后重置按钮状态
        yield put({ type: 'hideResetpwdLoading' })
        throw e
      }
      yield put({ type: 'hideResetpwdLoading' })
      if (data) {
        yield put({ type: 'app/query' })
        yield put(routerRedux.push('/logistics'))
      } else {
        throw data
      }
    },
    *sedMsg({payload},{put, call}){
      const data = yield call(sendMsg, payload)
      if(data){
        yield put({
          type: 'updateState',
          payload:{
            mobileCodeButtonDisable: true,
          },
        })
      }
    },
  },
  reducers: {
    updateState(state,{payload}){
      return {
        ...state,
        ...payload,
      }
    },
    showResetpwdLoading (state) {
      return {
        ...state,
        resetpwdLoading: true,
      }
    },
    hideResetpwdLoading (state) {
      return {
        ...state,
        resetpwdLoading: false,
      }
    },
    changeCtoken(state){
      return {...state, ctoken: "maijia:"+moment()+Math.random()}
    }

  },
}
