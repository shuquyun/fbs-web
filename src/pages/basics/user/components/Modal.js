import React from "react";
import PropTypes from "prop-types";
import { Form, Input, Modal, Icon, Row, Col, Select, Tree, Radio } from "antd";
const Option = Select.Option;
const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 14
    }
};

const modal = ({
    item = {},
    onOk,
    modalType,
    baseRole,
    form: { getFieldDecorator, validateFields, getFieldsValue },
    ...modalProps
}) => {
    const handleOk = () => {
        validateFields(errors => {
            if (errors) {
                return;
            }
            let fields = getFieldsValue();
            const data = {
                ...item,
                ...fields,
                roleName: fields.roleIdLevel
            };
            baseRole.map((item, index) => {
                if (item.name == fields.roleIdLevel) {
                    data.roleId = item.id;
                }
            });
            data.id = item.id;
            delete data.createdAt;
            delete data.updatedAt;

            delete data.roleIdLevel;
            onOk(data);
        });
    };

    const modalOpts = {
        ...modalProps,
        onOk: handleOk
    };

    return (
        <Modal {...modalOpts}>
            <Form layout="horizontal">
                <FormItem label="用户名" {...formItemLayout}>
                    <Row gutter={8}>
                        <Col span={24}>
                            {getFieldDecorator("userName", {
                                initialValue: item.userName,
                                rules: [
                                    {
                                        required: true,
                                        message: "请输入用户名"
                                    }
                                ]
                            })(
                                <Input
                                    disabled={
                                        modalType === "create" ? false : true
                                    }
                                />
                            )}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="手机号码" {...formItemLayout}>
                    <Row gutter={8}>
                        <Col span={24}>
                            {getFieldDecorator("userMobile", {
                                initialValue: item.userMobile,
                                rules: [
                                    {
                                        required: true,
                                        pattern: /^[1][345789][0-9]{9}$/,
                                        message: "请输入正确手机号码"
                                    }
                                ]
                            })(<Input />)}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="邮箱" {...formItemLayout}>
                    <Row gutter={8}>
                        <Col span={24}>
                            {getFieldDecorator("email", {
                                initialValue: item.email,
                                rules: [
                                    {
                                        required: true,
                                        pattern: /^([a-z0-9A-Z]+[-|_|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/,
                                        message: "请输入正确邮箱"
                                    }
                                ]
                            })(<Input />)}
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="用户角色" {...formItemLayout}>
                    <Row gutter={8}>
                        <Col span={24}>
                            {getFieldDecorator("roleIdLevel", {
                                initialValue:
                                    item.roleName && baseRole.length !== 0
                                        ? item.roleName
                                        : "",
                                rules: [
                                    {
                                        required: true,
                                        message: "请选择用户角色"
                                    }
                                ]
                            })(
                                <Select style={{ width: "100%" }}>
                                    {baseRole.length !== 0 &&
                                        baseRole.map((item, index) => {
                                            return (
                                                <Option
                                                    value={item.name}
                                                    key={item.id}
                                                >
                                                    {item.name}
                                                </Option>
                                            );
                                        })}
                                </Select>
                            )}
                        </Col>
                    </Row>
                </FormItem>
            </Form>
        </Modal>
    );
};

modal.propTypes = {
    form: PropTypes.object.isRequired,
    modalType: PropTypes.string,
    item: PropTypes.object,
    baseRole:PropTypes.object,
    onOk: PropTypes.func
};

export default Form.create()(modal);
