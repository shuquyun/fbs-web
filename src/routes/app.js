import React from 'react'
import PropTypes from 'prop-types'
import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import { Layout, Loader } from 'components'
import { classnames, config } from 'utils'
import { Helmet } from 'react-helmet'
import '../themes/index.less'
import './app.less'
import NProgress from 'nprogress'
import Error from './error'
import Modal from './Modal'

const { prefix, openPages } = config

const { Header, Bread, Footer, Sider, styles } = Layout
let lastHref

const App = ({ children, dispatch, app, loading, location }) => {
  const { user, siderFold, darkTheme, isNavbar, menuPopoverVisible,modalVisible, navOpenKeys,navSelectedKeys, menu } = app
  let { pathname } = location

  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  const { iconFontJS, iconFontCSS, logo } = config
  const href = window.location.href

  if (lastHref !== href) {
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
      lastHref = href
    }
  }

  const headerProps = {
    menu,
    user,
    siderFold,
    isNavbar,
    menuPopoverVisible,
    navOpenKeys,
    navSelectedKeys,
    switchMenuPopover () {
      dispatch({ type: 'app/switchMenuPopver' })
    },
    logout () {
      dispatch({ type: 'app/logout' })
    },
    update () {
      dispatch({ type: 'app/showModal' })
    },
    switchSider () {
      dispatch({ type: 'app/switchSider' })
    },
    changeOpenKeys (openKeys) {
      dispatch({
        type: 'app/handleNavOpenKeys',
        payload: { navOpenKeys: openKeys }
      })
    },
  }

  const siderProps = {
    menu,
    siderFold,
    darkTheme,
    navOpenKeys,
    navSelectedKeys,
    changeTheme () {
      dispatch({ type: 'app/switchTheme' })
    },
    changeOpenKeys (openKeys) {
      // localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
      dispatch({
        type: 'app/handleNavOpenKeys',
        payload: { navOpenKeys: openKeys }
      })
    },
    changeSelectedMenu(openKeys,selectedKeys){
      dispatch({
        type: 'app/handleClickNavMenu',
        payload: { navOpenKeys: openKeys, navSelectedKeys: selectedKeys }
      })
    },
  }

  const breadProps = {
    menu,
  }
  if (openPages && openPages.includes(pathname)) {
    return (<div>
      <Loader spinning={loading.effects['app/query']} />
      {children}
    </div>)
  }

  const modalProps = {
    visible: modalVisible,
    maskClosable: false,
    title: '修改密码',
    wrapClassName: 'vertical-center-modal',
    onOk(data) {
      dispatch({
        type: 'app/update',
        payload: {
          ...data,
        },
      })
    },
    onCancel() {
      dispatch({
        type: 'app/hideModal',
      })
    },
  }

  return (
    <div>
      <Helmet>
        <title>{config.name?config.name:'管理后台'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={config.logo} type="image/x-icon" />
        {iconFontJS && <script src={iconFontJS} />}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
      </Helmet>
      <div className={classnames(styles.layout, { [styles.fold]: isNavbar ? false : siderFold }, { [styles.withnavbar]: isNavbar })}>
        {!isNavbar ? <aside className={classnames(styles.sider, { [styles.light]: !darkTheme })}>
          <Sider {...siderProps} />
        </aside> : ''}
        <div className={styles.main}>
          <Header {...headerProps} />
          <Bread {...breadProps} />
          <div className={styles.container}>
            <div className={styles.content}>
              {children}
            </div>
          </div>
          <Footer />
        </div>
      </div>
      {modalVisible && <Modal {...modalProps} />}
    </div>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default connect(({ app, loading }) => ({ app, loading }))(App)
