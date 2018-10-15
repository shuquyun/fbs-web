import React from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import { Button, Row, Form, Input, Col, Checkbox } from "antd";
import { config } from "utils";
import styles from "./index.less";
import { Link } from "dva/router";
const { codeImgUrl } = config.api;

const FormItem = Form.Item;

const Login = ({
    login,
    dispatch,
    form: { getFieldDecorator, validateFieldsAndScroll }
}) => {
    const { ctoken, loginLoading } = login;
    function handleOk() {
        validateFieldsAndScroll((errors, values) => {
            if (errors) {
                return;
            }
            values.ctoken = ctoken;
            dispatch({ type: "login/login", payload: values });
        });
    }
    const changeCodeImg = () => {
        dispatch({ type: "login/changeCtoken" });
    };
    return (
        <div className={styles.form}>
            <div className={styles.logo}>
                <img alt="logo" src={config.logo} />
                <span>{config.name}</span>
            </div>
            <form>
                {/* <FormItem hasFeedback>
                    {getFieldDecorator("username", {
                        rules: [
                            {
                                required: true,
                                // pattern: /^[1][345789][0-9]{9}$/,
                                message: "请输入用户名"
                            }
                        ]
                    })(<Input onPressEnter={handleOk} placeholder="用户名" />)}
                </FormItem> */}
                <FormItem hasFeedback>
                    {getFieldDecorator("mobile", {
                        rules: [
                            {
                                required: true,
                                pattern: /^[1][345789][0-9]{9}$/,
                                message: "输入正确手机号码"
                            }
                        ]
                    })(
                        <Input
                            size="large"
                            onPressEnter={handleOk}
                            placeholder="请输入手机号码"
                        />
                    )}
                </FormItem>
                <FormItem hasFeedback>
                    {getFieldDecorator("password", {
                        rules: [
                            {
                                required: true,
                                message: "请输入密码"
                            }
                        ]
                    })(
                        <Input
                            type="password"
                            onPressEnter={handleOk}
                            placeholder="密码"
                        />
                    )}
                </FormItem>
                <FormItem hasFeedback className={styles.captcha}>
                    <Row>
                        <Col span={14}>
                            {getFieldDecorator("captcha", {
                                rules: [
                                    {
                                        required: true,
                                        pattern: /^.{4}$/,
                                        message: "请输入验证码"
                                    }
                                ]
                            })(
                                <Input
                                    onPressEnter={handleOk}
                                    placeholder="验证码"
                                />
                            )}
                        </Col>
                        <Col span={8}>
                            <img
                                height={30}
                                src={codeImgUrl + "?ctoken=" + ctoken}
                                onClick={changeCodeImg}
                            />
                        </Col>
                    </Row>
                </FormItem>
                <FormItem>
                    {getFieldDecorator("remember", {
                        valuePropName: "checked",
                        initialValue: false
                    })(<Checkbox>记住密码</Checkbox>)}
                    <Link to="resetpwd" style={{ float: "right" }}>
                        忘记密码？
                    </Link>
                    <Button
                        type="primary"
                        className="login-form-button"
                        onClick={handleOk}
                        loading={loginLoading}
                    >
                        登录
                    </Button>
                    {/* <Link to="register" style={{ float: "right" }}>
                        立即注册
                    </Link> */}
                </FormItem>
            </form>
        </div>
    );
};

Login.propTypes = {
    form: PropTypes.object,
    dispatch: PropTypes.func,
    login: PropTypes.object
};

export default connect(({ login }) => ({ login }))(Form.create()(Login));
