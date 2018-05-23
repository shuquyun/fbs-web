import React from 'react'
import {Table, Button,Row,Col, Modal,Icon} from 'antd'
import styles from './List.less'
import {formatDate, userMessageType} from 'utils'

const confirm = Modal.confirm

const List = ({
                onUpdateStatus,
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
      title: '发送人',
      dataIndex: 'fromUserName',
      key: 'fromUserName',
      width: '10%',
    }, {
      title: '接收人',
      dataIndex: 'userName',
      key: 'toUserName',
      width: '10%',
    }, {
      title: '手机号',
      dataIndex: 'userMobile',
      key: 'toUserMobile',
      width: '10%',
    }, {
      title: '消息标题',
      dataIndex: 'title',
      key: 'title',
      width: '10%',
    }, {
      title: '消息内容',
      dataIndex: 'content',
      key: 'content',
      width: '25%',
    }, {
      title: '消息类型',
      dataIndex: 'type',
      key: 'type',
      width: '10%',
      render:(text)=>(userMessageType(text))
    }, {
      title: '消息状态',
      dataIndex: 'status',
      key: 'status',
      width: '5%',
      render:(text, record)=>{
        if(record.status===1){
          return '已读'
        }else if(record.status===0){
          return '未读'
        }
      },
    }, {
      title: '消息发送时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '10%',
      render: (text)=>formatDate(text)
    }, {
      title: '操作',
      key: 'operation',
      width: '10%',
      render: (text, record)=>(
        <span>
          {record.status===0&&
          <span><a onClick={()=> onUpdateStatus(record.id, 1)}>已读</a></span>
          }
          {record.status===1&&
          <span>-</span>
          }
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
