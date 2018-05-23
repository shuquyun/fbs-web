import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import {
  query,
  create,
  remove,
  update,
  updateStatus,
} from '../../services/user/admin'
import  * as baseRoleService from '../../services/base/role'
import {pageModel} from '../common'

export default modelExtend(pageModel, {

  namespace: 'userAdmin',
  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    roleList: [],
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/user/admin') {
          dispatch({
            type: 'query',
            payload: {
              ...location.query,
            }
          })
        }
      })
    },
  },

  effects: {
    * query({payload = {}}, {call, put}) {
      if(!payload.pageNo){
        payload = {...payload, ...queryString.parse(location.search)}
      }
      const data = yield call(query, payload)
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.result.data,
            pagination: {
              current: Number(payload.pageNo) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.result.total,
            },
          },
        })
      } else {
        throw data
      }
    },
    *'delete' ({ payload }, { call, put, select }) {
      const data = yield call(remove, { ...payload })
      if (data) {
        yield put({ type: 'query' })
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
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    *updateStatus({ payload }, { select, call, put }) {
      const data = yield call(updateStatus, payload)
      if (data) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    *queryRoleListAndShowModal ({ payload }, { select, call, put }) {
      const data = yield call(baseRoleService.list, {})
      if (data) {
        yield put({
          type: 'showModal',
          payload: {
            ...payload,
            roleList: data,
          }
        })
      } else {
        throw data
      }
    },

  },

  reducers: {

    showModal(state, {payload}) {
      return {...state, ...payload, modalVisible: true}
    },

    hideModal(state) {
      return {...state, modalVisible: false}
    },


  },
})
