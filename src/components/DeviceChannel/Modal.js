import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Icon,Row,Col,Select,Tree,InputNumber } from 'antd'


const FormItem = Form.Item
const TreeNode = Tree.TreeNode;

const formItemLayout = {
  labelCol: {
    span: 4,
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
            <FormItem label="货道名称" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={24}>
                  {getFieldDecorator('name', {
                    initialValue: item.name,
                    rules: [
                      {
                        required: true,
                        message: '请输入货道名',
                      },
                    ],
                  })(<Input size="large"/>)}
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col >
            <FormItem label="货道容量" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={24}>
                  {getFieldDecorator('amount', {
                    initialValue: item.amount,
                    rules: [
                      {
                        required: true,
                        message: '请输入货道容量'
                      }
                    ],
                  })(<InputNumber size="large"/>)}
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col >
            <FormItem label="描述信息" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={24}>
                  {getFieldDecorator('description', {
                    initialValue: item.description,
                    rules: [
                      {
                      }
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
}

export default Form.create()(modal)
