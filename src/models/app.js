import { query, logout,updatePassword } from '../services/app'
import * as basePermission from '../services/base/permission'
import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType } from 'enums'
import {message} from 'antd'
import pathToRegexp from 'path-to-regexp'


const { prefix,openPages } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    permissions: {
      visit: [],
    },
    menu: [
      {
        id: 0,
        icon: 'laptop',
        name: '管理中心',
        router: '/dashboard',
      },
    ],
    menuPopoverVisible: false,
    modalVisible: false,
    siderFold: localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: true,
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: [],
    navSelectedKeys:[],
  },
  subscriptions: {

    setup ({ dispatch }) {
      if (!(openPages && openPages.includes(location.pathname))) {
        dispatch({
          type: 'query'
        })
      }
      // let tid
      // window.onresize = () => {
      //   clearTimeout(tid)
      //   tid = setTimeout(() => {
      //     dispatch({ type: 'changeNavbar' })
      //   }, 300)
      // }
    },

  },
  effects: {

    * query ({
      payload,
    }, { call, put }) {
      const data = yield call(query, payload)
      if (data) {
        const menu = yield call(basePermission.list)
        if(menu){
          let currentMenu = {}
          let defaultSelectedKeys
          let openKeys = []

          for (let item of menu) {
            if (item.url && pathToRegexp(item.url).exec(location.pathname)) {
              currentMenu = item
              break
            }
          }

          if (currentMenu) {
            defaultSelectedKeys = [currentMenu.id+""]
            const buildOpenKeys = (id)=>{
              for (let item of menu) {
                if (item.id ===id) {
                  openKeys.push(id+"")
                  buildOpenKeys(item.pid)
                }
              }
            }
            if(currentMenu.pid){
              buildOpenKeys(currentMenu.pid)
            }
          }


          yield put({
            type: 'updateState',
            payload: {
              menu,
              navSelectedKeys: defaultSelectedKeys,
              navOpenKeys: openKeys,
              user: data,
            },
          })
        }

        if (location.pathname === '/login') {
          yield put(routerRedux.push('/'))
        }
      }
    },

    * logout ({
      payload,
    }, { call, put }) {
      const data = yield call(logout, parse(payload))
      if (data) {
        yield put({ type: 'query' })
      } else {
        throw (data)
      }
    },
    * update({payload}, {put, call}) {
      const data = yield call(updatePassword, payload)
      if (data) {
        yield put({type: 'hideModal'})
        message.success("密码修改成功")
        yield put(routerRedux.push('/login'))
      } else {
        throw data
      }
    },
    * changeNavbar ({
      payload,
    }, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },

  },
  reducers: {
    updateState (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    switchSider (state) {
      localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme (state) {
      localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },

    handleClickNavMenu (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    showModal(state, {payload}) {
      return {...state, ...payload, modalVisible: true}
    },

    hideModal(state) {
      return {...state, modalVisible: false}
    },

  },
}
