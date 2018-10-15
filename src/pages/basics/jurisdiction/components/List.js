import React from "react";
import PropTypes from "prop-types";
import { Table, Modal } from "antd";
import classnames from "classnames";
import { DropOption } from "components";
import { Link } from "react-router-dom";
import AnimTableBody from "components/DataTable/AnimTableBody";
import styles from "./List.less";
import { formatDate } from "utils";

const { confirm } = Modal;

const List = ({
    onDeleteItem,
    onEditItem,
    location,
    onEditCode,
    changeStatus,
    ...tableProps
}) => {
    const handleMenuClick = (record, e) => {
        if (e.key === "1") {
            onEditItem(record);
        } else if (e.key === "2") {
            confirm({
                title: "确定要删除吗?",
                onOk() {
                    onDeleteItem(record.id);
                }
            });
        } else if (e.key === "3") {
            const status = { id: record.id };

            if (e.item.props.children == "启用") {
                status.status = 1;
            } else {
                status.status = -1;
            }
            confirm({
                title: `确定${e.item.props.children}吗?`,
                onOk() {
                    changeStatus(status);
                }
            });
        } else if (e.key === "4") {
            onEditCode(record);
        }
    };

    const columns = [
        {
            title: "菜单名称",
            dataIndex: "title",
            key: "title",
            render: (text, record) => (
                <Link to={`user/${record.id}`}>{text}</Link>
            )
        },
        {
            title: "编码",
            dataIndex: "code",
            key: "code"
        },
        {
            title: "图标",
            dataIndex: "icon",
            key: "icon"
        },
        {
            title: "链接",
            dataIndex: "url",
            key: "url"
        },
        {
            title: "描述",
            dataIndex: "description",
            key: "description"
        },
        {
            title: "类型",
            dataIndex: "type",
            key: "type",
            render: text => <span>{text == 1 ? "功能" : "菜单"}</span>
        },
        {
            title: '序号',
            dataIndex: 'sort',
            key: 'sort'
        },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            render: text => <span>{text == 1 ? "正常" : "禁用"}</span>
        },
        {
            title: "创建时间",
            dataIndex: "createdAt",
            key: "createdAt",
            render: text => formatDate(text)
        },
        {
            title: "操作",
            key: "operation",
            width: 100,
            render: (text, record) => {
                let menuOptions = [
                    { key: "1", name: "编辑" },
                    { key: "2", name: "删除" }
                ];

                return (
                    <DropOption
                        onMenuClick={e => handleMenuClick(record, e)}
                        menuOptions={menuOptions}
                    />
                );
            }
        }
    ];





    return (
        <Table
            {...tableProps}
            className={classnames(styles.table)} //{ [styles.motion]: isMotion }
            bordered
            scroll={{ x: 1250 }}
            columns={columns}
            simple
            rowKey={record => record.id}

        />
    );
};

List.propTypes = {
    onDeleteItem: PropTypes.func,
    onEditCode: PropTypes.func,
    onEditItem: PropTypes.func,
    onEditCode: PropTypes.func,
    location: PropTypes.object
};

export default List;
