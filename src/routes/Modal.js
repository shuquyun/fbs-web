import React from 'react'
import PropTypes from 'prop-types'
import {Modal,Form, Input, Icon, message} from 'antd'

const FormItem = Form.Item


const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}
const modal = ({
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
      const data = {
        ...getFieldsValue(),
      }
      if(data.newPwd!==data.checkPassword){
        message.error("两次输入密码不一致")
        return
      }
      delete data.checkPassword
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }


  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="旧密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('oldPwd', {
            rules: [
              {
                required: true,
                message: '请输入旧密码 !',
              },
            ],
          })(<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入旧密码"/>)}
        </FormItem>
        <FormItem label="新密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('newPwd', {
            rules: [
              {
                required: true,
                message: '请输入新密码 !',
              }
            ],
          })(<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password"  placeholder="请输入新密码"/>)}
        </FormItem>
        <FormItem label="确认密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('checkPassword', {
            rules: [
              {
                required: true,
                message: '请输入确认密码 !',
              }
            ],
          })(<Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入确认密码"/>)}
        </FormItem>
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
