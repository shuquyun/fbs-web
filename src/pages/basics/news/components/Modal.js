import React from "react";
import PropTypes from "prop-types";
import { Form, Input, Modal, Icon, Row, Col, Select, Tree } from "antd";

const FormItem = Form.Item;

const formItemLayout = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 16
    }
};

const modal = ({
    item = {},
    able,
    onOk,
    sureAndCancel,
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
                ...fields
            };
            onOk(data);
        });
    };
    const modalOpts = {
        ...modalProps,
        onOk: handleOk
    };
    if (sureAndCancel == "footer") {
        modalOpts.footer = null;
    }

    const selectPlat = value => {
        switch (value) {
            case 0:
                return "APP";
                break;
            case 1:
                return "管理后台";
            case 2:
                return "营销平台";
            default:
                break;
        }
    };
    return (
        <Modal {...modalOpts}>
            <Form>
                <Row>
                    <Col>
                        <FormItem label="消息推送平台：" {...formItemLayout}>
                            <Row gutter={8}>
                                <Col span={24}>
                                    {getFieldDecorator("platform", {
                                        initialValue: selectPlat(item.platform),
                                        rules: [
                                            {
                                                required: true,
                                                message: "请输入消息推送平台："
                                            }
                                        ]
                                    })(
                                        <Select
                                            placeholder="请输入消息推送平台"
                                            disabled={able}
                                        >
                                            <Select.Option value="0">
                                                APP
                                            </Select.Option>
                                            <Select.Option value="1">
                                                管理后台
                                            </Select.Option>
                                            <Select.Option value="2">
                                                营销平台
                                            </Select.Option>
                                        </Select>
                                    )}
                                </Col>
                            </Row>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem label="消息标题" {...formItemLayout}>
                            <Row gutter={8}>
                                <Col span={24}>
                                    {getFieldDecorator("title", {
                                        initialValue: item.title,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请输入消息标题"
                                            }
                                        ]
                                    })(<Input size="large" disabled={able} />)}
                                </Col>
                            </Row>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem label="消息内容" {...formItemLayout}>
                            <Row gutter={8}>
                                <Col span={24}>
                                    {getFieldDecorator("content", {
                                        initialValue: item.content,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请输入消息内容"
                                            }
                                        ]
                                    })(
                                        <Input.TextArea
                                            autosize={{
                                                minRows: 5,
                                                maxRows: 10
                                            }}
                                            disabled={able}
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

modal.propTypes = {
    form: PropTypes.object.isRequired,
    item: PropTypes.object,
    onOk: PropTypes.func,
};

export default Form.create()(modal);
