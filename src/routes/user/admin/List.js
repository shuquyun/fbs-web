import React from 'react'
import {Table, Modal,Row, Col} from 'antd'
import styles from './List.less'
import {formatDate, adminStatus} from 'utils'

const confirm = Modal.confirm

const List = ({onEditItem, onDeleteItem, onUpdateStatus, ...tableProps}) => {

  const deleteItemEvent = (record) =>{
    confirm({
      title: '确定要删除当前管理员吗?',
      onOk () {
        onDeleteItem(record.id)
      },
    })
  }

  const columns = [
    {
      title: '用户名',
      dataIndex: 'userName',
      width: '20%',
    }, {
      title: '手机号',
      dataIndex: 'userMobile',
      width: '20%',
    }, {
      title: '用户角色',
      dataIndex: 'roleName',
      width: '10%',
    }, {
      title: '状态',
      dataIndex: 'status',
      width: '10%',
      render: text => adminStatus(text),
    }, {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: '20%',
      render: (text) => formatDate(text, "YYYY-MM-DD HH:mm:ss")
    }, {
      title: '操作',
      width: '20%',
      render: (text, record)=>(
        <span>
          {record.status===-1&&
          <span><a onClick={()=> onUpdateStatus(record.id, 1)}>启用</a>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          }
          {record.status===1&&
          <span><a onClick={()=> onUpdateStatus(record.id, -1)}>禁用</a>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          }
          <span><a onClick={()=> onEditItem(record)}>编辑</a></span>
        </span>
      ),

    },
  ]

  return (
    <div>
      <Table
        {...tableProps}
        bordered
        columns={columns}
        scroll={{x: 0}}
        simple
        className={styles.table}
        rowKey={record => record.id}
      />
    </div>
  )
}


export default List
