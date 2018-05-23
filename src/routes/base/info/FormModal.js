import React from 'react'
import PropTypes from 'prop-types'
import {Form, Input, InputNumber, Cascader, Icon, Row, Col, Select, Button} from 'antd'
import {city} from '../../../utils/city'


const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
}

const FormModal = ({
                     item = {},
                     onOk,
                     form: {
                       getFieldDecorator,
                       validateFields,
                       getFieldsValue,
                       resetFields,
                     },
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
        id: item.id,
      }
      delete data.addressPCA
      onOk(data)
    })
  }

  const onChangeAdress = (value,addressOptions)=>{
    item.province = addressOptions[0].name
    item.city = addressOptions[1].name
    if(addressOptions.length>2){
      //东莞等特殊市没有区
      item.area = addressOptions[2].name
      item.areaCode = addressOptions[2].value
    }
    item.provinceCode = addressOptions[0].value
    item.cityCode = addressOptions[1].value
  }


  return (
    <Form>
      <FormItem
        {...formItemLayout}
        label="真实姓名"
      >
        {getFieldDecorator('name', {
          initialValue: item.name,
          rules: [
            {
              required: true,
              message: '请输入真实姓名',
            }
          ],
        })(
          <Input />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="昵称"
      >
        {getFieldDecorator('nickName', {
          initialValue: item.nickName,
          rules: [
            {
              required: true,
              message: '请输入昵称'
            }
          ],
        })(
          <Input />
        )}
      </FormItem>
      <FormItem {...formItemLayout} label="性别">
        {getFieldDecorator('sex', {
          initialValue: item.sex?item.sex:3,
          rules: [
            {
              required: true,
              message: '请选择性别',
            }
          ],
        })(
          <Select>
            <Select.Option value={1}>男</Select.Option>
            <Select.Option value={2}>女</Select.Option>
            <Select.Option value={3}>未知</Select.Option>
          </Select>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="省市区"
      >
        {getFieldDecorator('addressPCA', {
          initialValue: item.provinceCode && [item.provinceCode, item.cityCode, item.areaCode],
          rules: [
            {
              required: true,
              message: '请选择省市区',
            }
          ],
        })(
          <Cascader  options={city()} placeholder="请选择省市区" onChange={onChangeAdress}/>
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="详细地址"
      >
        {getFieldDecorator('address', {
          initialValue: item.address,
          rules: [
            {
              required: true,
              message: '请输入详细地址',
            }
          ],
        })(
          <Input />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="邮编"
      >
        {getFieldDecorator('postcode', {
          initialValue: item.postcode,
          rules: [
            {
              required: true,
              message: '请输入邮编',
            }
          ],
        })(
          <Input />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="邮箱"
      >
        {getFieldDecorator('email', {
          initialValue: item.email,
          rules: [
            {
              pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
              message: '输入的邮箱格式不正确 !',
            }
          ],
        })(
          <Input />
        )}
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="qq"
      >
        {getFieldDecorator('qq', {
          initialValue: item.qq,
          rules: [
            {
            }
          ],
        })(
          <Input />
        )}
      </FormItem>

      <FormItem {...formItemLayout} label=" " colon={false}
      >
        <Button type="primary" onClick={handleOk}>保存</Button>
      </FormItem>

    </Form>
  )
}

FormModal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  changeConsignor: PropTypes.func,
}

export default Form.create()(FormModal)
