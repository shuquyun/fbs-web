import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Switch } from 'antd'
import styles from './Layout.less'
import { config } from 'utils'
import Menus from './Menu'

const Sider = ({ siderFold, darkTheme, location, changeTheme, navOpenKeys, navSelectedKeys, changeOpenKeys, menu, changeSelectedMenu }) => {
  const menusProps = {
    menu,
    siderFold,
    darkTheme,
    location,
    navOpenKeys,
    navSelectedKeys,
    changeOpenKeys,
    changeSelectedMenu,
  }
  return (
    <div>
      <div className={styles.logo}>
        <img alt={'logo'} src={config.logo} />
        {siderFold ? '' : <a href="/"><span>{config.name}</span></a>}
      </div>
      <Menus {...menusProps} />
    </div>
  )
}

Sider.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  location: PropTypes.object,
  changeTheme: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Sider
