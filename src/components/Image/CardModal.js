import React from 'react'
import PropTypes from 'prop-types'
import { Modal, } from 'antd'





class CardModal extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showModal: false,
    }
  }

  render(){
    const hideCardModalEvent = ()=>{
      this.setState({showModal: false})
    }
    const modalOpts = {
      visible: this.state.showModal,
      maskClosable: true,
      wrapClassName: 'vertical-center-modal',
      width: '70%',
      footer: null,
      onCancel: hideCardModalEvent,

    }
    const showCardModalEvent = ()=>{
      this.setState({showModal: true})
    }

    return (
      <div>
        <img src={this.props.imageUrl} height={100} onClick={showCardModalEvent} />
        {this.state.showModal&&
        <Modal {...modalOpts}>
          <img src={this.props.imageUrl} width={"90%"} />
        </Modal>
        }
      </div>
    )
  }

}


CardModal.propTypes = {

}

export default CardModal
