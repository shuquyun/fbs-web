import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Index = ({ dispatch, loading, location, userRole}) => {
  const {list, pagination, currentItem, modalVisible,modalType, menuList} = userRole
  const {query = {}, pathname} = location
  const {pageSize, statPay, statTotal} = pagination

  const filterProps = {
    filter: {
      ...location.query,
    },
    onAdd () {
      dispatch({
        type: 'userRole/getMenuAndShowModal',
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
    loading: loading.effects['userRole/query'],
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
        type: 'userRole/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'userRole/getMenuAndShowModal',
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
    title: `${modalType === 'create' ? '新建角色' : '修改角色'}`,
    wrapClassName: 'vertical-center-modal',
    width: '90%',
    onCancel() {
      dispatch({
        type: 'userRole/hideModal',
      })
    },
    onOk(item){
      dispatch({
        type: 'userRole/update',
        payload: item
      })
    }
  }


  return (<div className="content-inner">
    <Filter {...filterProps}/>
    <List {...listProps} />
    {modalVisible && <Modal {...modalProps} />}
  </div>)
}

Index.propTypes = {
  userRole: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({userRole, loading}) => ({userRole, loading}))(Index)
