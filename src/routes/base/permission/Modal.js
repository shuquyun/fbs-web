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
        status: 1,
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
            <FormItem label="权限类型" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={24}>
                  {getFieldDecorator('type', {
                    initialValue: item.type,
                    rules: [
                      {
                        required: true,
                        message: '请选择权限类型',
                      },
                    ],
                  })(
                    <Select>
                      <Select.Option value={1}>菜单</Select.Option>
                      <Select.Option value={2}>功能</Select.Option>
                    </Select>

                  )}
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="权限名称" {...formItemLayout}>
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
            <FormItem label="权限描述" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={24}>
                  {getFieldDecorator('description', {
                    initialValue: item.description,
                    rules: [
                      {
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
            <FormItem label="权限图标" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={24}>
                  {getFieldDecorator('icon', {
                    initialValue: item.icon,
                    rules: [
                      {
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
            <FormItem label="上级权限" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={24}>
                  {getFieldDecorator('pid', {
                    initialValue: item.pid?item.pid:0,
                    rules: [
                      {
                        required: true,
                        message: '请选择上级权限',
                      }
                    ],
                  })(
                    <Select placeholder="请选择上级权限">
                      <Select.Option value={0}>最顶级</Select.Option>
                      {menuSelectOptions}
                    </Select>
                  )}
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col >
            <FormItem label="编码" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={24}>
                  {getFieldDecorator('code', {
                    initialValue: item.code,
                    rules: [
                      {
                        required: true,
                        message: '编码',
                      }
                    ],
                  })(<Input size="large"/>)}
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col >
            <FormItem label="URL" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={24}>
                  {getFieldDecorator('url', {
                    initialValue: item.url,
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
        <Row>
          <Col >
            <FormItem label="排序" {...formItemLayout}>
              <Row gutter={8}>
                <Col span={24}>
                  {getFieldDecorator('sort', {
                    initialValue: item.sort?item.sort+"":"",
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
  changeConsignor: PropTypes.func,
}

export default Form.create()(modal)
