import React from 'react'
import {Table, Button,Row,Col, Modal} from 'antd'
import styles from './List.less'
import {formatDate} from 'utils'

const confirm = Modal.confirm

const List = ({
                onEditItem,
                onEditItemPermission,
                onDeleteItem,
                ...tableProps,
  }) => {

  const deleteItemEvent = (record) =>{
    confirm({
      title: '确定要删除当前角色吗?',
      onOk () {
        onDeleteItem(record.id)
      },
    })
  }


  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '40%',
    }, {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '10%',
      render:(text)=>formatDate(text)
    }, {
      title: '操作',
      key: 'operation',
      width: '20%',
      render: (text, record)=>(
        <span>
          <span span={6}><a onClick={()=> onEditItem(record)}>编辑</a>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <span span={12}><a onClick={()=> onEditItemPermission(record)}>权限分配</a>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <span span={6}><a onClick={()=> deleteItemEvent(record)}>删除</a></span>
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
