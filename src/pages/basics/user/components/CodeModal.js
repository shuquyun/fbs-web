import React from "react";
import PropTypes from "prop-types";
import { Form, Input, Modal, Icon, Row, Col } from "antd";

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 12
    }
};

const codeModal = ({
    item,
    onOk,
    form: { getFieldDecorator, validateFields, getFieldsValue, getFieldValue },
    ...codeModalProps
}) => {
    const { changeConfirmDirty, confirmDirty } = codeModalProps;
    const handleOk = () => {
        validateFields(errors => {
            if (errors) {
                return;
            }
            let fields = getFieldsValue();
            let data = fields.confirmPassword;
            onOk(item, data);
        });
    };

    //自定义校验--确认密码
    const handleConfirmBlur = e => {
        const value = e.target.value;
        changeConfirmDirty({ confirmDirty: confirmDirty || !!value });
    };
    const compareToFirstPassword = (rule, value, callback) => {
        if (value && value !== getFieldValue("password")) {
            callback("两次密码输入不一致!");
        } else {
            callback();
        }
    };

    const validateToNextPassword = (rule, value, callback) => {
        if (value && confirmDirty) {
            validateFields(["confirmPassword"], { force: true });
        }
        callback();
    };

    const modalOpts = {
        ...codeModalProps,
        onOk: handleOk,
        title: "重置密码"
    };

    return (
        <Modal {...modalOpts}>
            <Form>
                <Row style={{ marginTop: "30px" }}>
                    <Col>
                        <FormItem label="设置新密码" {...formItemLayout}>
                            <Row gutter={8}>
                                <Col span={24}>
                                    {getFieldDecorator("password", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "请输入密码"
                                            },
                                            {
                                                validator: validateToNextPassword
                                            }
                                        ]
                                    })(
                                        <Input
                                            size="large"
                                            type="password"
                                            placeholder="请输入密码"
                                        />
                                    )}
                                </Col>
                            </Row>
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem label="确认密码" {...formItemLayout}>
                            <Row gutter={8}>
                                <Col span={24}>
                                    {getFieldDecorator("confirmPassword", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "请输入密码"
                                            },
                                            {
                                                validator: compareToFirstPassword
                                            }
                                        ]
                                    })(
                                        <Input
                                            size="large"
                                            type="password"
                                            onBlur={handleConfirmBlur}
                                            placeholder="确认密码"
                                        />
                                    )}
                                </Col>
                            </Row>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

codeModal.propTypes = {
    form: PropTypes.object.isRequired,
    item: PropTypes.object,
    onOk: PropTypes.func
};

export default Form.create()(codeModal);
