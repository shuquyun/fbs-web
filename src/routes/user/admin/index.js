import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Index = ({ dispatch, loading, location, userAdmin}) => {
  const {list, pagination, currentItem, modalVisible,modalType, roleList} = userAdmin
  const {query = {}, pathname} = location
  const {pageSize} = pagination

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
    onSearch(fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/userAdmin',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/userAdmin',
      }))
    },
    onAdd() {
      dispatch({
        type: `userAdmin/queryRoleListAndShowModal`,
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
    loading: loading.effects['userAdmin/query'],
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
    onEditItem(item) {
      dispatch({
        type: 'userAdmin/queryRoleListAndShowModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    onDeleteItem(id){
      dispatch({
        type: 'userAdmin/delete',
        payload: {
          id,
        }
      })
    },
    onUpdateStatus(id, status){
      dispatch({
        type: 'userAdmin/updateStatus',
        payload: {
          id,
          status
        },
      })
    }
  }

  const modalProps = {
    roleList,
    item: currentItem,
    visible: modalVisible,
    maskClosable: false,
    title: `${modalType === 'create' ? '新建管理员' : '修改管理员'}`,
    wrapClassName: 'vertical-center-modal',
    width: '60%',
    onCancel() {
      dispatch({
        type: 'userAdmin/hideModal',
      })
    },
    onOk(item) {
      dispatch({
        type: `userAdmin/${modalType}`,
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
  userAdmin: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({userAdmin, loading}) => ({userAdmin, loading}))(Index)
