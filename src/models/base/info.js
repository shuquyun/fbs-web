import pathToRegexp from 'path-to-regexp'
import queryString from 'query-string'
import { query,create,update,queryUserInfo } from '../../services/base/info'
import {message} from 'antd'

export default {

  namespace: 'baseInfo',

  state: {
    userInfo: {},
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/base/info') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {
    *query ({
      payload,
    }, { call, put }) {
      const data = yield call(queryUserInfo, payload)
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            userInfo: data,
          },
        })
      } else {
        throw data
      }
    },
    *create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data) {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *update ({ payload }, { select, call, put }) {
      const data = yield call(update, payload)
      if (data) {
        message.success("个人信息修改成功")
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
  },

  reducers: {
    querySuccess (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
