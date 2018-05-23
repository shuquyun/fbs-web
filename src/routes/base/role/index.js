import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'
import PermissionModal from './PermissionModal'

const Index = ({ dispatch, loading, location, baseRole}) => {
  const {list, pagination, currentItem, modalVisible,modalType, permission} = baseRole
  const {query = {}, pathname} = location
  const {pageSize, statPay, statTotal} = pagination

  const filterProps = {
    filter: {
      ...location.query,
    },
    onAdd () {
      dispatch({
        type: 'baseRole/showModal',
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
    loading: loading.effects['baseRole/query'],
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
        type: 'baseRole/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'baseRole/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    onEditItemPermission(item){
      dispatch({
        type: 'baseRole/getMenuAndShowPermissionModal',
        payload: {
          modalType: 'updatePermission',
          currentItem: item,
        },
      })
    },
  }

  const modalProps = {
    item: currentItem,
    visible: modalVisible,
    maskClosable: false,
    title: `${modalType === 'create' ? '新建角色' : '修改角色'}`,
    wrapClassName: 'vertical-center-modal',
    width: '50%',
    onCancel() {
      dispatch({
        type: 'baseRole/hideModal',
      })
    },
    onOk(item){
      dispatch({
        type: `baseRole/${modalType}`,
        payload: {...item}
      })
    }
  }

  const permissionModalProps = {
    permission,
    item: permission.currentItem,
    visible: permission.modalVisible,
    maskClosable: false,
    title: '权限分配',
    wrapClassName: 'vertical-center-modal',
    width: '80%',
    onCancel() {
      dispatch({
        type: 'baseRole/hidePermissionModal',
      })
    },
    onOk(item){
      dispatch({
        type: `baseRole/updatePermission`,
        payload: {...item}
      })
    }
  }


  return (<div className="content-inner">
    <Filter {...filterProps}/>
    <List {...listProps} />
    {modalVisible && <Modal {...modalProps} />}
    {permission.modalVisible && <PermissionModal {...permissionModalProps}/>}
  </div>)
}

Index.propTypes = {
  baseRole: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({baseRole, loading}) => ({baseRole, loading}))(Index)
