import React from 'react'
import PropTypes from 'prop-types'
import { Breadcrumb, Icon } from 'antd'
import { Link } from 'dva/router'
import styles from './Bread.less'
import pathToRegexp from 'path-to-regexp'
import { queryArray } from 'utils'

const Bread = ({ menu }) => {
  // 匹配当前路由
  let pathArray = []
  let current
  const buildDefaultSelectedKeys = (menuList)=>{
    for (let item of menuList) {
      if (item.url && pathToRegexp(item.url).exec(location.pathname)) {
        current = item
        break
      }
      if(item.children){
        buildDefaultSelectedKeys(item.children)
      }

    }
  }
  buildDefaultSelectedKeys(menu)

  const getPathArray = (item) => {
    pathArray.unshift(item)
    if (item.pid) {
      getPathArray(queryArray(menu, item.pid, 'id'))
    }
  }


  if (!current) {
    pathArray.push(menu[0] || {
      id: 1,
      icon: 'laptop',
      title: '管理中心',
    })
  } else {
    getPathArray(current)
  }

  // 递归查找父级
  const breads = pathArray.map((item, key) => {
    const content = (
      <span>{item.icon
        ? <Icon type={item.icon} style={{ marginRight: 4 }} />
        : ''}{item.title}</span>
    )
    return (
      <Breadcrumb.Item key={key}>
        {content}
      </Breadcrumb.Item>
    )
  })

  return (
    <div className={styles.bread}>
      <Breadcrumb>
        {breads}
      </Breadcrumb>
    </div>
  )
}

Bread.propTypes = {
  menu: PropTypes.array,
}

export default Bread
