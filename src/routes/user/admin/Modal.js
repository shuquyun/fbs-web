import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Icon,Row,Col,Select, } from 'antd'


const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
                 roleList= [],
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
      data.roleId = data.role.key
      data.roleName = data.role.label
      delete data.role

      onOk(data)
    })
  }


  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const roleOptions = roleList.map((item)=>{
    return <Select.Option value={item.id}>{item.name}</Select.Option>
  })


  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <Row gutter={24}>
          <Col span={24}>
            <FormItem label="用户名" hasFeedback {...formItemLayout}>
              {getFieldDecorator('userName', {
                initialValue: item.userName,
                rules: [
                  {
                    required: true,
                    message: '用户名不能为空 !',
                  },
                ],
              })(<Input placeholder="请输入用户名" disabled = {item.id &&(true)} />)}
            </FormItem>

          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <FormItem label="手机号" hasFeedback {...formItemLayout}>
              {getFieldDecorator('userMobile', {
                initialValue: item.userMobile,
                rules: [
                  {
                    required: true,
                    len: 11,
                    pattern: /^1[34578]\d{9}$/,
                    message: '输入的电话号码格式不正确 !',
                  },
                ],
              })(<Input placeholder="请输入手机号" disabled = {item.id &&(true)} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <FormItem label="管理员角色" hasFeedback {...formItemLayout}>
              {getFieldDecorator('role',
                {
                  initialValue: {key: item.roleId},
                  rules: [
                    {
                      required: true,
                      message: '请选择管理员角色',
                    },
                  ],
                },
              )(
                <Select placeholder="请选择管理员角色" labelInValue={true}>
                  {roleOptions}
                </Select>
              )}
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
