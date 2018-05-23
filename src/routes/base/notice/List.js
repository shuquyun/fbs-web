import React from 'react'
import {Table, Button,Row,Col, Modal,Icon} from 'antd'
import moment from 'moment'
import styles from './List.less'

import {formatDate} from 'utils'

const confirm = Modal.confirm

const List = ({
                onEditItem,
                onDeleteItem,
                ...tableProps,
  }) => {
  const deleteItemEvent = (record) =>{
    confirm({
      title: '确定要删除当前公告吗?',
      onOk () {
        onDeleteItem(record.id)
      },
    })
  }


  const columns = [
    {
      title: '公告标题',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
    }, {
      title: '公告内容',
      dataIndex: 'content',
      key: 'content',
      width: '40%',
    }, {
      title: '所属平台',
      dataIndex: 'platform',
      key: 'platform',
      width: '10%',
    }, {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '20%',
      render: (text)=>formatDate(text)
    }, {
      title: '操作',
      key: 'operation',
      width: '10%',
      render: (text, record)=>(
        <span>
          <span><a onClick={()=> onEditItem(record)}>编辑</a>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <span><a onClick={()=> deleteItemEvent(record)}>删除</a></span>
        </span>
      ),
    },
  ]

  return (
    <div>
      <Table
        {...tableProps}
        bordered
        scroll={{x: 0}}
        columns={columns}
        simple
        className={styles.table}
        rowKey={record => record.id}
      />
    </div>
  )
}


export default List
