import React from "react";
import PropTypes from "prop-types";
import DataTree from "../../../../components/DateTree/DateTree";
import { arrayToTree, queryArray } from "utils";
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
    permission,
    modalType,
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
                status: 1,
                ...item,
                ...fields
            };
            if (modalType !== "create") {
                data.id = item.id;
            }
            onOk(data);
        });
    };

    const modalOpts = {
        ...modalProps,
        onOk: handleOk
    };
    const menuSelectOptions = permission.menuList.map(menu => {
        return (
            <Select.Option value={menu.id} key={menu.id}>
                {menu.title}
            </Select.Option>
        );
    });

    return (
        <Modal {...modalOpts}>
            <Form layout="horizontal">
                <FormItem label="权限类型" {...formItemLayout}>
                    {getFieldDecorator("type", {
                        initialValue: item.type,
                        rules: [
                            {
                                required: true,
                                message: "请选择权限类型"
                            }
                        ]
                    })(
                        <Select>
                            <Select.Option value={1}>菜单</Select.Option>
                            <Select.Option value={2}>功能</Select.Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label="权限名称" {...formItemLayout}>
                    {getFieldDecorator("title", {
                        initialValue: item.title,
                        rules: [
                            {
                                required: true,
                                message: "请输入标题"
                            }
                        ]
                    })(<Input size="large" />)}
                </FormItem>
                <FormItem label="权限描述" {...formItemLayout}>
                    {getFieldDecorator("description", {
                        initialValue: item.description,
                        rules: []
                    })(<Input size="large" />)}
                </FormItem>
                <FormItem label="权限图标" {...formItemLayout}>
                    {getFieldDecorator("icon", {
                        initialValue: item.icon,
                        rules: [{}]
                    })(<Input size="large" />)}
                </FormItem>
                <FormItem label="上级权限" {...formItemLayout}>
                    {getFieldDecorator("pid", {
                        initialValue: item.pid ? item.pid : 0,
                        rules: [
                            {
                                required: true,
                                message: "请选择上级权限"
                            }
                        ]
                    })(
                        <Select placeholder="请选择上级权限">
                            <Select.Option value={0}>最顶级</Select.Option>
                            {menuSelectOptions}
                        </Select>
                    )}
                </FormItem>
                <FormItem label="编码" {...formItemLayout}>
                    {getFieldDecorator("code", {
                        initialValue: item.code,
                        rules: [
                            {
                                required: true,
                                message: "请输入编码"
                            }
                        ]
                    })(<Input size="large" />)}
                </FormItem>
                <FormItem label="URL" {...formItemLayout}>
                    {getFieldDecorator("url", {
                        initialValue: item.url,
                        rules: []
                    })(<Input size="large" />)}
                </FormItem>
                <FormItem label="排序" {...formItemLayout}>
                    {getFieldDecorator("sort", {
                        initialValue: item.sort,
                        rules: [
                            {
                                required: true,
                                message: '排序不能为空'
                            }
                        ]
                    })(<Input size="large" />)}
                </FormItem>
            </Form>
        </Modal>
    );
};

modal.propTypes = {
    form: PropTypes.object.isRequired,
    modalType: PropTypes.string,
    item: PropTypes.object,
    onOk: PropTypes.func,
    permission: PropTypes.object
};

export default Form.create()(modal);
