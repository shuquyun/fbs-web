import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Icon,Row,Col,Select,Tree } from 'antd'


const FormItem = Form.Item
const TreeNode = Tree.TreeNode;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 15,
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
    footer: null,
  }

  return (
    <Modal {...modalOpts}>

      <Row gutter={24}>
          <FormItem label="用户名" {...formItemLayout}>
            {item.name}
          </FormItem>
      </Row>
      <Row gutter={24}>
        <FormItem label="手机号码" {...formItemLayout}>
          {item.mobile}
        </FormItem>
      </Row>
      <Row gutter={24}>
        <FormItem label="用户昵称" {...formItemLayout}>
          {item.nickName}
        </FormItem>
      </Row>
      <Row gutter={24}>
        <FormItem label="用户来源" {...formItemLayout}>
          {item.platform}
        </FormItem>
      </Row>

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
