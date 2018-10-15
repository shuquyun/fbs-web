import React from "react";
import PropTypes from "prop-types";
import { Table, Modal } from "antd";
import classnames from "classnames";
import { DropOption } from "components";
import { Link } from "react-router-dom";
import AnimTableBody from "components/DataTable/AnimTableBody";
import styles from "./List.less";

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
            console.log(1234);
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

            // confirm({
            //     title: "确定要重置该用户密码吗？",
            //     onOk() {
            //     }
            // });
        }
    };

    const columns = [
        {
            title: "用户名",
            dataIndex: "userName",
            key: "userName",
            render: (text, record) => (
                <Link to={`user/${record.id}`}>{text}</Link>
            )
        },
        {
            title: "手机号码",
            dataIndex: "userMobile",
            key: "userMobile"
        },
        {
            title: "用户角色",
            dataIndex: "roleName",
            key: "roleName"
        },
        {
            title: "账号状态",
            dataIndex: "status",
            key: "status",
            render: text => <span>{text == 1 ? "启用状态" : "禁用状态"}</span>
        },
        {
            title: "操作",
            key: "operation",
            width: 100,
            render: (text, record) => {
                let menuOptions = [
                    { key: "1", name: "编辑" },
                    { key: "2", name: "删除" },
                    { key: "3", name: "启用" },
                    { key: "4", name: "重置密码" }
                ];
                if (record.status == 1) {
                    menuOptions[2] = { key: "3", name: "禁用" };
                }
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

    return (
        <Table
            {...tableProps}
            className={classnames(styles.table)} //{ [styles.motion]: isMotion }
            bordered
            scroll={{ x: 1250 }}
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
    changeStatus:PropTypes.func,
    onEditCode:PropTypes.func,
    location: PropTypes.object
};

export default List;
