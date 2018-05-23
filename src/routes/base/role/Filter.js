import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import {FilterItem} from 'components'
import CountUp from 'react-countup'
import {Form, Button, Row, Col, DatePicker, Input, Select,Popconfirm} from 'antd'

const {RangePicker} = DatePicker
const Option = Select.Option

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}


const Filter = ({
                  filter,
                  onAdd,
                }) => {

  return (<div>
    <Row>
      <Col span={24} style={{marginBottom: 16,paddingRight: '16px'}}>
        <Button size="large" type="primary" onClick={onAdd}>新建</Button>
      </Col>
    </Row>
  </div>)
}

Filter.propTypes = {
}

export default (Filter)
