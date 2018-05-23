import React from 'react'
import {Table, Button,Row,Col, Modal} from 'antd'
import styles from './List.less'
import {formatDate, userStatus} from 'utils'

const confirm = Modal.confirm

const List = ({
                onEditItem,
                onUpdateItemStatus,
                onDeleteItem,
                ...tableProps,
  }) => {

  const deleteItemEvent = (record) =>{
    confirm({
      title: '确定要删除当前用户吗?',
      onOk () {
        onDeleteItem(record.id)
      },
    })
  }


  const columns = [
    {
      title: '手机号码',
      dataIndex: 'mobile',
      key: 'mobile',
      width: '20%',
    }, {
      title: '真实姓名',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    }, {
      title: '用户来源',
      dataIndex: 'platform',
      key: 'platform',
      width: '10%',
    }, {
      title: '用户状态',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      render: (text)=>userStatus(text)
    }, {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: '20%',
      render: (text) => formatDate(text,"YYYY-MM-DD HH:mm:ss")
    }, {
      title: '操作',
      key: 'operation',
      width: '20%',
      render: (text, record)=>(
        <Row>
          {record.status===1&&(
            <Col span={12}><a onClick={()=> onUpdateItemStatus(record.id,0)}>禁用</a></Col>
          )}
          {record.status===0&&(
            <Col span={12}><a onClick={()=> onUpdateItemStatus(record.id,1)}>启用</a></Col>
          )}
          <Col span={12}><a onClick={()=> onEditItem(record)}>详情</a></Col>
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
