import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {FilterItem} from 'components'
import CountUp from 'react-countup'
import {Form, Button, Row, Col, DatePicker, Input, Select,Popconfirm} from 'antd'

const {RangePicker} = DatePicker
const Option = Select.Option

const ColProps = {
  xs: 12,
  sm: 6,
  style: {
    marginBottom: 16,
  },
}


const Filter = ({
                  onFilterChange,
                  onAdd,
                  filter,
                  form: {
                    getFieldDecorator,
                    getFieldsValue,
                    setFieldsValue,
                  },
                }) => {

  const handleFields = (fields) => {

    return fields
  }

  const handleSubmit = () => {
    let fields = getFieldsValue()
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  const handleReset = () => {
    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    handleSubmit()
  }

  const handleChange = (key, values) => {
    let fields = getFieldsValue()
    fields[key] = values
    fields = handleFields(fields)
    onFilterChange(fields)
  }

  return (<div>
    <Row gutter={24}>
      <Col {...ColProps}>
        {getFieldDecorator('mobile',
          {
            initialValue: filter.mobile,
          }
        )(<Input placeholder="手机号" size="large"/>)}
      </Col>
      <Col {...ColProps}>
        {getFieldDecorator('role', {
          initialValue: filter.role,
          rules: [

          ],
        })(
          <Select  size="large" placeholder="请选择用户来源" style={{width: '100%'}}>
            <Select.Option value='admin'>管理员</Select.Option>
            <Select.Option value='agent'>代理商</Select.Option>
            <Select.Option value='biz'>运营商</Select.Option>
          </Select>
        )}
      </Col>
      <Col {...ColProps}>
        <Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>查询</Button>
        <Button size="large" onClick={handleReset}>重置</Button>
      </Col>
    </Row>

  </div>)
}

Filter.propTypes = {
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
  onCreate: PropTypes.func,
}

export default Form.create()(Filter)
