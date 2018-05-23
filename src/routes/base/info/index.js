import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import FormModal from './FormModal'

const BaseInfo = ({ baseInfo,dispatch }) => {

  const formProps = {
    item: baseInfo.userInfo,

    onOk (item) {
      dispatch({
        type: 'baseInfo/update',
        payload: {
          ...item
        },
      })
    },
  }

  return (<div className="content-inner">
   <FormModal {...formProps} />
  </div>)
}

BaseInfo.propTypes = {
  baseInfo: PropTypes.object,
  loading: PropTypes.bool,
}

export default connect(({ baseInfo, loading }) => ({ baseInfo, loading: loading.models.baseInfo }))(BaseInfo)
