import React from "react";
import PropTypes from "prop-types";
import { Form, Input, Modal, Icon, Row, Col, Select, Tree } from "antd";

const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

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
    onOk,
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

    return (
        <Modal {...modalOpts}>
            <Form>
                <Row>
                    <Col>
                        <FormItem label="公告内容" {...formItemLayout}>
                            <Row gutter={8}>
                                <Col span={24}>
                                    {getFieldDecorator("content", {
                                        initialValue: item.content,
                                        rules: [
                                            {
                                                required: true,
                                                message: "请输入公告内容"
                                            }
                                        ]
                                    })(
                                        <Input.TextArea
                                            autosize={{
                                                minRows: 4,
                                                maxRows: 4
                                            }}
                                        />
                                    )}
                                </Col>
                            </Row>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem label="所属平台" {...formItemLayout}>
                            <Row gutter={8}>
                                <Col span={24}>
                                    {getFieldDecorator("platform", {
                                        initialValue: item.platform
                                            ? item.platform
                                            : "管理后台",
                                        rules: [
                                            {
                                                required: true,
                                                message: "请选择发送平台"
                                            }
                                        ]
                                    })(
                                        <Select placeholder="请选择公告发送平台">
                                            <Select.Option value="管理后台">
                                                管理后台
                                            </Select.Option>
                                            <Select.Option value="营销后台">
                                                薪资后台
                                            </Select.Option>
                                            <Select.Option value="APP">
                                                APP
                                            </Select.Option>
                                        </Select>
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
