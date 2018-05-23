import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'dva'
import {routerRedux} from 'dva/router'
import List from './List'
import Filter from './Filter'
import Modal from './Modal'

const Index = ({ dispatch, loading, location, baseNotice}) => {
  const {list, pagination, currentItem, modalVisible,modalType} = baseNotice
  const {query = {}, pathname} = location
  const {pageSize, statPay, statTotal} = pagination

  const filterProps = {
    filter: {
      ...location.query,
    },
    onAdd () {
      dispatch({
        type: 'baseNotice/showModal',
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
    loading: loading.effects['baseNotice/query'],
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
        type: 'baseNotice/delete',
        payload: id,
      })
    },
    onEditItem (item) {
      dispatch({
        type: 'baseNotice/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
  }

  const modalProps = {
    item: currentItem,
    visible: modalVisible,
    maskClosable: false,
    title: `${modalType === 'create' ? '新建公告' : '修改公告'}`,
    wrapClassName: 'vertical-center-modal',
    width: '50%',
    onCancel() {
      dispatch({
        type: 'baseNotice/hideModal',
      })
    },
    onOk(item) {
      dispatch({
        type: `baseNotice/${modalType}`,
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
  baseNotice: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({baseNotice, loading}) => ({baseNotice, loading}))(Index)
