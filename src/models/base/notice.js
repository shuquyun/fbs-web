import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import {query, remove, update, queryById, create} from '../../services/base/notice'
import {pageModel} from '../common'

export default modelExtend(pageModel, {

  namespace: 'baseNotice',
  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/base/notice') {
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
      if (data) {
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
      const data = yield call(remove, { id: payload })
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


    *getMenuAndShowModal({payload={}},{call, put}){
      yield put({
        type: 'showModal',
        payload:{
          ...payload,
          menuList: data
        },
      })
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
