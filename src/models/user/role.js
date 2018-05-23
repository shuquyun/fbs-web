import modelExtend from 'dva-model-extend'
import queryString from 'query-string'
import {query, remove, update, queryById, create} from '../../services/user/role'
import * as basePermissionService  from '../../services/base/permission'
import {pageModel} from '../common'

export default modelExtend(pageModel, {

  namespace: 'userRole',
  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    menuList: [],
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/user/role') {
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
            list: data.data,
            pagination: {
              current: Number(payload.pageNo) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
              statPay: data.statPay,
              statTotal: data.statTotal,
            },
          },
        })
      } else {
        throw data
      }
    },
    *roleDetail({payload={}},{call,put}){
      yield put({
        type: 'showModal',
        payload:{}
      })
    },
    *getMenuAndShowModal({payload={}},{call, put}){
      const data = yield call(basePermissionService.menuList, payload)
      yield put({
        type: 'showModal',
        payload:{menuList: data},
      })
    },

  },

  reducers: {

    showModal(state, {payload}) {
      return {...state, ...payload, modalVisible: true}
    },

    hideModal(state) {
      return {...state, menuList:[], modalVisible: false}
    },

  },
})
