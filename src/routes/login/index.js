import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Col, Form, Input,Checkbox } from 'antd'
import { config } from 'utils'
import styles from './index.less'
import {Link} from 'dva/router'
const { codeImgUrl } = config.api

const FormItem = Form.Item

const Login = ({
  login,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  const { loginLoading ,ctoken} = login

  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      values.ctoken = ctoken
      dispatch({ type: 'login/login', payload: values })
    })
  }
  const changeCodeImg =()=>{
    dispatch({type: 'login/changeCtoken'})
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
          })(<Input size="large" onPressEnter={handleOk} placeholder="请输入手机号" />)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码',
              },
            ],
          })(<Input size="large" type="password" onPressEnter={handleOk} placeholder="请输入密码" />)}
        </FormItem>
        <FormItem hasFeedback>
          <Row>
            <Col span={12}>
              {getFieldDecorator('captcha', {
                rules: [
                  {
                    required: true,
                    message: "请输入图形验证码",
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
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: false,
          })(
            <Checkbox>记住密码</Checkbox>
          )}
          <Link to="resetpwd" style={{float: 'right'}}>忘记密码</Link>
          <Button type="primary" className="login-form-button"  onClick={handleOk} loading={loginLoading}>
            登录
          </Button>
        </FormItem>

      </form>
    </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  login: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ login }) => ({ login }))(Form.create()(Login))
