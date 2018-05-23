import React from 'react'
import {Table, Button,Row,Col, Modal} from 'antd'
import styles from './List.less'

const confirm = Modal.confirm

class DeviceChannel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }
  render () {
    const {
      onEditItem,
      onDeleteItem,
      ...tableProps,
    } = this.props


    const deleteItemEvent = (record) =>{
      confirm({
        title: '确定要删除当前设备型号吗?',
        onOk () {
          onDeleteItem(record.id)
        },
      })
    }


    const columns = [
      {
        title: '设备名',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
      }, {
        title: '设备型号',
        dataIndex: 'model',
        key: 'model',
        width: '10%',
      }, {
        title: '设备编号',
        dataIndex: 'deviceNo',
        key: 'deviceNo',
        width: '10%',
      }, {
        title: '设备厂商',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        width: '10%',
      }, {
        title: '设备状态',
        key: 'status',
        width: '10%',
        render: (text,record)=>{
          if(record.status===1){
            return '正常'
          }else if(record.status===0){
            return '异常'
          }else{
            return '删除'
          }
        },
      }, {
        title: '设备地址',
        dataIndex: 'address',
        key: 'address',
        width: '20%',
      }, {
        title: '操作',
        key: 'operation',
        width: '20%',
        render: (text, record)=>(
          <Row>
            {/*<Col span={12}><a onClick={()=> deleteItemEvent(record)}>货道管理</a></Col>*/}
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

}


export default DeviceChannel
