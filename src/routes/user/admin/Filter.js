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
        {getFieldDecorator('status', {
          initialValue: filter.status,
          rules: [

          ],
        })(
          <Select placeholder="请选择管理员状态" style={{width: '100%'}} size="large">
            <Select.Option value='1'>正常</Select.Option>
            <Select.Option value='-1'>禁用</Select.Option>
          </Select>
        )}
      </Col>
      <Col {...ColProps}>
        <Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>查询</Button>
        <Button size="large" onClick={handleReset}>重置</Button>
      </Col>
    </Row>
    <Row>
      <Col style={{marginBottom: 16,paddingRight: '16px'}}>
        <Button type="primary" size="large" className="margin-right" icon="user-add"
                onClick={onAdd}>添加管理员</Button>
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
