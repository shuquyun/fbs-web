import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Icon,Row,Col,Select,Tree } from 'antd'

import { arrayToTree, queryArray } from 'utils'


const FormItem = Form.Item
const TreeNode = Tree.TreeNode;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
}

const modal = ({
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
        level: 1,
        sort: 0,
        ...item,
        ...fields,
      }
      onOk(data)
    })
  }



  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }


  return (
    <Modal {...modalOpts}>
      <Form>
        <Row>
          <Col>
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
          <Col>
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
