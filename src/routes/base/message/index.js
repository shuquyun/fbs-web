import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Index = ({ dispatch, loading, location, baseMessage}) => {
  const {list, pagination, currentItem, modalVisible,modalType, menuList} = baseMessage
  const {query = {}, pathname} = location
  const {pageSize, statPay, statTotal} = pagination

  const filterProps = {
    filter: {
      ...location.query,
    },
    onAdd () {
      dispatch({
        type: 'baseMessage/showModal',
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
    loading: loading.effects['baseMessage/query'],
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
        type: 'baseMessage/delete',
        payload: id,
      })
    },
    onUpdateStatus (id, status) {
      dispatch({
        type: 'baseMessage/updateStatus',
        payload: {
          id,
          status,
        },
      })
    },
  }

  const modalProps = {
    menuList,
    item: currentItem,
    visible: modalVisible,
    maskClosable: false,
    title: `${modalType === 'create' ? '新建菜单' : '修改菜单'}`,
    wrapClassName: 'vertical-center-modal',
    width: '60%',
    onCancel() {
      dispatch({
        type: 'baseMessage/hideModal',
      })
    },
    onOk(item) {
      dispatch({
        type: `baseMessage/${modalType}`,
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
  baseMessage: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({baseMessage, loading}) => ({baseMessage, loading}))(Index)
