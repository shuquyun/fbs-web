import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row,Col, Form, Input,Checkbox } from 'antd'
import { config } from 'utils'
import styles from './index.less'
import {Link} from 'dva/router'
import MobileCode from '../../components/MobileCode/MobileCode'
const { codeImgUrl } = config.api

const FormItem = Form.Item

const Resetpwd = ({
                 resetpwd,
                 dispatch,
                 form: {
                   getFieldDecorator,
                   validateFieldsAndScroll,
                   getFieldsValue,
                 },
               }) => {
  const { resetpwdLoading ,ctoken, mobile,captcha,mobileCodeLoding,mobileCodeDisable,mobileCodeButtonDisable,isAgree} = resetpwd

  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'resetpwd/resetpwd', payload: values })
    })
  }
  const changeCodeImg =()=>{
    dispatch({type: 'resetpwd/changeCtoken'})
  }
  const sendMobileCode= ()=> {
    validateFieldsAndScroll(["mobile","captcha"],(errors, values) => {
      if (errors) {
        return
      }
      dispatch({
        type: `resetpwd/sedMsg`,
        payload: {
          mobile:values.mobile,
          ctoken,
          captcha:values.captcha,
        },
      })
    })
  }
  const enableMobileCodeButton = ()=>{
    dispatch({
      type: 'resetpwd/updateState',
      payload: {
        mobileCodeButtonDisable: false,
      },
    })
  }


  return (
    <div className={styles.form}>
      <div className={styles.logo}>
        <img alt={'logo'} src={config.logo} />
        <span>{config.name}</span>
      </div>
      <form>
        <FormItem hasFeedback>
          {getFieldDecorator('mobile', {
            rules: [
              {
                required: true,
                pattern: /^1[34578]\d{9}$/,
                message: '输入手机号不合法!',
              },
            ],
          })(<Input size="large" onPressEnter={handleOk} placeholder="请输入手机号码" />)}
        </FormItem>

        <FormItem hasFeedback>
          <Row>
            <Col span={12}>
              {getFieldDecorator('captcha', {
                rules: [
                  {
                    required: true,
                    message: "请输入验证码"
                  },
                ],
              })(<Input size="large" onPressEnter={handleOk} placeholder="请输入图形验证码" />)}
            </Col>
            <Col span={12}>
              <img height={30} src={codeImgUrl+"?ctoken="+ctoken} onClick={changeCodeImg}/>
            </Col>

          </Row>
        </FormItem>
        <FormItem>
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('authCode', {
                rules: [
                  {
                    required: true,
                    message: '手机验证码不能为空!'
                  }
                  ],
              })(
                <Input size="large" onPressEnter={handleOk} placeholder="请输入手机验证码" />
              )}
            </Col>
            <Col span={12}>
              <MobileCode
                loading={mobileCodeLoding}
                sendMobileCode={sendMobileCode}
                mobileCodeButtonDisable={mobileCodeButtonDisable}
                enableMobileCodeButton={enableMobileCodeButton}
              />
            </Col>
          </Row>
        </FormItem>

        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码',
              },
            ],
          })(<Input size="large" onPressEnter={handleOk} type="password" placeholder="请输入密码" />)}
        </FormItem>
        <FormItem>
          <Button type="primary" className="login-form-button"  onClick={handleOk} loading={resetpwdLoading}>
            找回密码
          </Button>
          <Link to="login">登录</Link>
        </FormItem>

      </form>
    </div>
  )
}

Resetpwd.propTypes = {
  form: PropTypes.object,
  resetpwd: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ resetpwd }) => ({ resetpwd }))(Form.create()(Resetpwd))
