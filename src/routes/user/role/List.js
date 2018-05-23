import React from 'react'
import {Table, Button,Row,Col, Modal} from 'antd'
import styles from './List.less'

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
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    }, {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: '50%',
    }, {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '10%',
    }, {
      title: '操作',
      key: 'operation',
      width: '10%',
      render: (text, record)=>(
        <Row>
          <Col span={12}><a onClick={()=> onEditItem(record)}>编辑</a></Col>
          <Col span={12}><a onClick={()=> deleteItemEvent(record)}>删除</a></Col>
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
