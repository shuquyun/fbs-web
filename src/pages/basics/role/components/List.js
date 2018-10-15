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
    onAllotItem,
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
            onAllotItem(record);
        }
    };

    const columns = [
        {
            title: "角色名称",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <Link to={`user/${record.id}`}>{text}</Link>
            )
        },
        {
            title: "描述",
            dataIndex: "description",
            key: "description",
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
                    { key: "2", name: "删除" },
                    { key: "3", name: "分配权限" }
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

    const AnimateBody = props => {
        return <AnimTableBody {...props} />;
    };

    const CommonBody = props => {
        return <tbody {...props} />;
    };

    return (
        <Table
            {...tableProps}
            className={classnames(styles.table)} //{ [styles.motion]: isMotion }
            bordered
            scroll={{ x: 1000 }}
            columns={columns}
            simple
            rowKey={record => record.id}
            components={{
                body: { AnimateBody }
            }}
        />
    );
};

List.propTypes = {
    onDeleteItem: PropTypes.func,
    onEditItem: PropTypes.func,
    onAllotItem: PropTypes.func,
    location: PropTypes.object
};

export default List;
