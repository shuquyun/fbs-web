import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Icon,Row,Col,Select,Tree, message } from 'antd'

import DataTree from '../../../components/DataTree/DataTree'
import { arrayToTree, queryArray } from 'utils'


const FormItem = Form.Item
const TreeNode = Tree.TreeNode;

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
                 permission,
                 item = {},
                 onOk,
                 form: {
                   getFieldDecorator,
                   validateFields,
                   getFieldsValue,
                 },
                 ...modalProps
               }) => {
  const handleOk = () => {
    if(!permission.checkedKeys){
      message.error("请先选择对应权限菜单")
      return
    }
    const data = {
      roleId: item.id,
      permissionIdList:permission.checkedKeys.join(","),
    }
    onOk(data)
  }



  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
    width: '90%',
  }

  const dataTreeProps = {
    treeData: arrayToTree(permission.menuList, 'id', 'pid'),
    onCheck(keys){
      permission.checkedKeys=keys
    },
    checkedKeys: permission.checkedKeys.map((key)=>{
      return key+""
    }),

  }

  return (
    <Modal {...modalOpts}>
      <Form>
        <Row>
          <Col span={8}>
            <FormItem label="角色名称" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={14}>
                  {item.name}
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem label="角色描述" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={14}>
                  {item.description}
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem label="角色权限" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={14}>
                  <DataTree {...dataTreeProps}/>
                </Col>
              </Row>
            </FormItem>
          </Col>

        </Row>

      </Form>

    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  changeConsignor: PropTypes.func,
}

export default Form.create()(modal)
