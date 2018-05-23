import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Index = ({ dispatch, loading, location, userList}) => {
  const {list, pagination, currentItem, modalVisible,modalType} = userList
  const {query = {}, pathname} = location
  const {pageSize, statPay, statTotal} = pagination

  const filterProps = {
    filter: {
      ...location.query,
    },
    onFilterChange(value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          pageNo: 1,
          pageSize,
        },
      }))
    },
    onAdd() {
      dispatch({
        type: `userList/showModal`,
        payload: {
          modalType: 'create',
          currentItem: {},
        },
      })
    }
  }

  const listProps = {
    pagination,
    dataSource: list,
    loading: loading.effects['userList/query'],
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
        type: 'userList/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'userList/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    onUpdateItemStatus (id,status) {
      dispatch({
        type: 'userList/updateItemStatus',
        payload: {
          id,
          status,
        },
      })
    },
  }

  const modalProps = {
    item: currentItem,
    visible: modalVisible,
    maskClosable: false,
    title: `${modalType === 'create' ? '新建账户' : '用户详情'}`,
    wrapClassName: 'vertical-center-modal',
    width: '50%',
    onCancel() {
      dispatch({
        type: 'userList/hideModal',
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
  userList: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({userList, loading}) => ({userList, loading}))(Index)
