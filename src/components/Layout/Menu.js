import React from 'react'
import PropTypes from 'prop-types'
import { Menu, Icon } from 'antd'
import { Link } from 'dva/router'
import { arrayToTree, queryArray } from 'utils'
import pathToRegexp from 'path-to-regexp'

const Menus = ({ siderFold, darkTheme, changeSelectedMenu, navOpenKeys, navSelectedKeys, changeOpenKeys, menu }) => {
  // 生成树状
  const menuTree = arrayToTree(menu.filter(_ => _.pid !== '-1'), 'id', 'pid')
  const levelMap = {}

  const handleClickNavMenu = (item)=>{
    const openKeys = item.keyPath.filter((keys)=>keys!==item.key)
    changeSelectedMenu(openKeys,[item.key])
  }

  // 递归生成菜单
  const getMenus = (menuTreeN, siderFoldN) => {
    return menuTreeN.map((item) => {
      if (item.children) {
        if (item.pid) {
          levelMap[item.id] = item.pid
        }
        return (
          <Menu.SubMenu
            key={item.id}
            title={<span>
              {item.icon && <Icon type={item.icon} />}
              {(!siderFoldN || !menuTree.includes(item)) && item.title}
            </span>}
          >
            {getMenus(item.children, siderFoldN)}
          </Menu.SubMenu>
        )
      }
      return (
        <Menu.Item key={item.id}>
          <Link to={item.url}>
            {item.icon && <Icon type={item.icon} />}
            {(!siderFoldN || !menuTree.includes(item)) && item.title}
          </Link>
        </Menu.Item>
      )
    })
  }
  const menuItems = getMenus(menuTree, siderFold)

  // 保持展开
  const getAncestorKeys = (key) => {
    let map = {}
    const getParent = (index) => {
      const result = [String(levelMap[index])]
      if (levelMap[result[0]]) {
        result.unshift(getParent(result[0])[0])
      }
      return result
    }
    for (let index in levelMap) {
      if ({}.hasOwnProperty.call(levelMap, index)) {
        map[index] = getParent(index)
      }
    }
    return map[key] || []
  }

  const onOpenChange = (openKeys) => {
    const latestOpenKey = openKeys.find(key => !navOpenKeys.includes(key))
    const latestCloseKey = navOpenKeys.find(key => !openKeys.includes(key))
    let nextOpenKeys = []
    if (latestOpenKey) {
      nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey)
    }
    if (latestCloseKey) {
      nextOpenKeys = getAncestorKeys(latestCloseKey)
    }
    changeOpenKeys(nextOpenKeys)
  }

  let menuProps =  {
    onOpenChange,
    openKeys: navOpenKeys,
    selectedKeys: navSelectedKeys,
    mode: siderFold ? 'vertical' : 'inline',
    theme: 'dark' ,
    onClick: handleClickNavMenu,
  }


  return (
    <Menu
      {...menuProps}
    >
      {menuItems}
    </Menu>
  )
}

Menus.propTypes = {
  menu: PropTypes.array,
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  isNavbar: PropTypes.bool,
  changeSelectedMenu: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Menus
