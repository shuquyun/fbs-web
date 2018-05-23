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
        type: 2,
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
  const menuSelectOptions = menuList.map((menu)=>{
    return <Select.Option value={menu.id}>{menu.title}</Select.Option>
  })

  return (
    <Modal {...modalOpts}>
      <Form>
        <Row>
          <Col>
            <FormItem label="接收人手机" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={24}>
                  {getFieldDecorator('userMobile', {
                    initialValue: item.userMobile,
                    rules: [
                      {
                        required: true,
                        message: '请输入消息接收人手机号',
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
            <FormItem label="消息标题" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={24}>
                  {getFieldDecorator('title', {
                    initialValue: item.title,
                    rules: [
                      {
                        required: true,
                        message: '请输入消息标题',
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
            <FormItem label="消息内容" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={24}>
                  {getFieldDecorator('content', {
                    initialValue: item.content,
                    rules: [
                      {
                        required: true,
                        message: '请输入消息内容',
                      },
                    ],
                  })(<Input.TextArea autosize={{ minRows: 5, maxRows: 10 }}></Input.TextArea>)}
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
