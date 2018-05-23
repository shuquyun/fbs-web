import React from 'react'
import {Table, Button,Row,Col, Modal,Icon} from 'antd'
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
      title: '确定要删除当前角色吗?',
      onOk () {
        onDeleteItem(record.id)
      },
    })
  }


  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'title',
      key: 'title',
      width: '20%',
    }, {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      width: '10%',
    }, {
      title: '图标',
      dataIndex: 'icon',
      key: 'icon',
      width: '10%',
    }, {
      title: '链接',
      dataIndex: 'url',
      key: 'url',
      width: '20%',
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '10%',
    }, {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: '5%',
      render: (text)=>{
        if(text===1){
          return '菜单'
        }else if(text===2){
          return '功能'
        }
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '5%',
      render: (text)=>{
        if(text===0){
          return '禁用'
        }else if(text===1){
          return '正常'
        }
      }
    }, {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '10%',
      render:(text)=>formatDate(text)
    }, {
      title: '操作',
      key: 'operation',
      width: '10%',
      render: (text, record)=>(
        <Row>
          <span><a onClick={()=> onEditItem(record)}>编辑</a>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          <span><a onClick={()=> deleteItemEvent(record)}>删除</a></span>
        </Row>
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
