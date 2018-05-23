import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Index = ({ dispatch, loading, location, basePermission}) => {
  const {list, pagination, currentItem, modalVisible,modalType, menuList} = basePermission
  const {query = {}, pathname} = location
  const {pageSize, statPay, statTotal} = pagination

  const filterProps = {
    filter: {
      ...location.query,
    },
    onAdd () {
      dispatch({
        type: 'basePermission/getMenuAndShowModal',
        payload: {
          modalType: 'create',
          item: {},
          currentItem: {},
        },
      })
    },
  }

  const listProps = {
    pagination,
    dataSource: list,
    loading: loading.effects['basePermission/query'],
    onChange(page) {
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          pageNo: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onDeleteItem (id) {
      dispatch({
        type: 'basePermission/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'basePermission/getMenuAndShowModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
  }

  const modalProps = {
    menuList,
    item: currentItem,
    visible: modalVisible,
    maskClosable: false,
    title: `${modalType === 'create' ? '新建权限' : '修改权限'}`,
    wrapClassName: 'vertical-center-modal',
    width: '50%',
    onCancel() {
      dispatch({
        type: 'basePermission/hideModal',
      })
    },
    onOk(item) {
      dispatch({
        type: `basePermission/${modalType}`,
        payload:{...item},
      })
    },
  }


  return (<div className="content-inner">
    <Filter {...filterProps}/>
    <List {...listProps} />
    {modalVisible && <Modal {...modalProps} />}
  </div>)
}

Index.propTypes = {
  basePermission: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({basePermission, loading}) => ({basePermission, loading}))(Index)
