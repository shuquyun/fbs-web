import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Icon,Row,Col,Select,Tree } from 'antd'


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
            <FormItem label="公告标题" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={24}>
                  {getFieldDecorator('title', {
                    initialValue: item.title,
                    rules: [
                      {
                        required: true,
                        message: '请输入标题',
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
            <FormItem label="公告内容" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={24}>
                  {getFieldDecorator('content', {
                    initialValue: item.content,
                    rules: [
                      {
                        required: true,
                        message: '请输入公告内容',
                      },
                    ],
                  })(<Input.TextArea autosize={{ minRows: 4, maxRows: 4 }}></Input.TextArea>)}
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col >
            <FormItem label="所属平台" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={24}>
                  {getFieldDecorator('platform', {
                    initialValue: item.platform?item.platform:'全平台',
                    rules: [
                      {
                        required: true,
                        message: '请选择发送平台',
                      }
                    ],
                  })(
                    <Select placeholder="请选择公告发送平台">
                      <Select.Option value='全平台'>全平台</Select.Option>
                      <Select.Option value='代理商'>代理商</Select.Option>
                      <Select.Option value='运营商'>运营商</Select.Option>
                      <Select.Option value='APP'>APP</Select.Option>
                    </Select>
                  )}
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
