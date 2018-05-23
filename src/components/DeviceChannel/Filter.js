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
                  filter,
                  onAdd,
                  onFilterChange,
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


  const { name, status } = filter

  return (<div>
    <Row gutter={24}>
      <Col {...ColProps}>
        {getFieldDecorator('name', { initialValue: name })(<Input.Search placeholder="设备名" size="large" onSearch={handleSubmit} />)}
      </Col>
      <Col {...ColProps}>
        {getFieldDecorator('status', { initialValue: Number(status) })
        (
          <Select placeholder="设备状态" style={{width: '100%'}}>
            <Select.Option value={1}>正常</Select.Option>
            <Select.Option value={0}>故障</Select.Option>
          </Select>
        )}
      </Col>

      <Col {...ColProps}>
        <Button type="primary" size="large" className="margin-right" onClick={handleSubmit}>查询</Button>
        <Button size="large" onClick={handleReset}>重置</Button>
      </Col>
    </Row>
    <Row>
      <Col span={24} style={{marginBottom: 16,paddingRight: '16px'}}>
        <Button size="large" type="primary" onClick={onAdd}>新建</Button>
      </Col>
    </Row>
  </div>)
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
}

export default Form.create()(Filter)
