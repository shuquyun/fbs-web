import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon, Popover, Avatar, Dropdown, Tag, message, Spin, Badge } from 'antd'
import styles from './Header.less'
import Menus from './Menu'
import { config } from '../../utils'
import { Link } from 'dva/router'

const SubMenu = Menu.SubMenu

const Header = ({ user, logout,update, switchSider, siderFold, isNavbar, menuPopoverVisible, location, switchMenuPopover, navOpenKeys, changeOpenKeys, menu }) => {
  let handleClickMenu = (e) =>{
    e.key === 'logout' && logout()
    e.key === 'update' && update()
  }
  const menusProps = {
    menu,
    siderFold: false,
    darkTheme: false,
    isNavbar,
    handleClickNavMenu: switchMenuPopover,
    location,
    navOpenKeys,
    changeOpenKeys,
  }
  const menuUser = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={handleClickMenu} >
      <Menu.Item key="update"><Icon type="user" />修改密码</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
    </Menu>
  );
  return (
    <div className={styles.header}>
      <Icon
        className={styles.trigger}
        type={siderFold ? 'menu-unfold' : 'menu-fold'}
        onClick={switchSider}
      />
      <div className={styles.right}>
        <a href="/base/message">
          <Badge count={0}>
            <Icon type="mail" style={{width: 25, fontSize: 20}} />
          </Badge>
        </a>

        {user.name ? (

          <Dropdown overlay={menuUser}>
                  <span className={`${styles.action} ${styles.account}`}>
                    <Avatar size="small" className={styles.avatar} src={config.logo} />
                    {user.name}
                  </span>
          </Dropdown>
        ) : <Spin size="small" style={{ marginLeft: 8 }} />}
      </div>

    </div>
  )
}

Header.propTypes = {
  menu: PropTypes.array,
  user: PropTypes.object,
  logout: PropTypes.func,
  update: PropTypes.func,
  switchSider: PropTypes.func,
  siderFold: PropTypes.bool,
  isNavbar: PropTypes.bool,
  menuPopoverVisible: PropTypes.bool,
  location: PropTypes.object,
  switchMenuPopover: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Header
