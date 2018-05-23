import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Icon,Row,Col,Select,Tree } from 'antd'

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
                 menuList = [],
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
    validateFields((errors) => {
      if (errors) {
        return
      }
      let fields = getFieldsValue()
      const data = {
        ...item,
        ...fields,
      }
      onOk(data)
    })
  }



  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
    width: '90%',
  }

  const dataTreeProps = {
    treeData: arrayToTree(menuList, 'id', 'pid'),
    onCheck(keys){
      item.checkedKeys=keys
    },
    checkedKeys: item.checkedKeys,

  }

  return (
    <Modal {...modalOpts}>
      <Form>
        <Row>
          <Col span={8}>
            <FormItem label="角色名称" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={24}>
                  {getFieldDecorator('name', {
                    initialValue: item.name,
                    rules: [
                      {
                        required: true,
                        message: '请输入角色名',
                      },
                    ],
                  })(<Input size="large"/>)}
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem label="角色描述" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={24}>
                  {getFieldDecorator('description', {
                    initialValue: item.description,
                    rules: [

                    ],
                  })(<Input size="large"/>)}
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
