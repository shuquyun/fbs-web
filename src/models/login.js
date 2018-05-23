import { login } from '../services/login'
import { routerRedux } from 'dva/router'
import { queryURL } from 'utils'
import moment from 'moment'

export default {
  namespace: 'login',
  state: {
    loginLoading: false,
    ctoken:  "maijia:"+moment()+Math.random(),
  },
  effects: {
    *login ({
      payload,
    }, { put, call }) {
      yield put({ type: 'showLoginLoading' })
      let data
      try {
        data = yield call(login, payload)
      }catch (e){
        yield put({ type: 'hideLoginLoading' })
        throw e
      }
      yield put({ type: 'hideLoginLoading' })
      if (data) {
        yield put({ type: 'app/query' })
        const from = queryURL('from')
        if (from) {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/'))
        }
      } else {
        throw data
      }
    },
  },
  reducers: {
    showLoginLoading (state) {
      return {
        ...state,
        loginLoading: true,
      }
    },
    hideLoginLoading (state) {
      return {
        ...state,
        loginLoading: false,
      }
    },
    changeCtoken(state){
      return {...state, ctoken: moment()+Math.random()}
    }

  },
}
