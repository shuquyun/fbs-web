import React from "react";
import PropTypes from "prop-types";
import { Table, Modal } from "antd";
import { DropOption } from "components";
import { Link } from "react-router-dom";
import AnimTableBody from "components/DataTable/AnimTableBody";
import styles from "./List.less";

const { confirm } = Modal;

const List = ({ onDeleteItem, onEditItem, location, ...tableProps }) => {
    const handleMenuClick = (record, e) => {
        if (e.key === "1") {
            onEditItem(record);
        } else if (e.key === "2") {
            confirm({
                title: "Are you sure delete this record?",
                onOk() {
                    onDeleteItem(record.id);
                }
            });
        }
    };

    const columns = [
        {
            title: "消息添加者",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <Link to={`user/${record.id}`}>{text}</Link>
            )
        },
        {
            title: "消息内容",
            dataIndex: "nickName",
            key: "nickName"
        },
        {
            title: "公告平台",
            dataIndex: "age",
            key: "age"
        },

        {
            title: "操作",
            key: "operation",
            width: 100,
            render: (text, record) => {
                return (
                    <DropOption
                        onMenuClick={e => handleMenuClick(record, e)}
                        menuOptions={[
                            { key: "1", name: "详情" },
                            { key: "2", name: "删除" }
                        ]}
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
            className={styles.table}
            bordered
            scroll={{ x: 1250 }}
            columns={columns}
            simple
            rowKey={record => record.id}
            components={{
                body: AnimateBody
            }}
        />
    );
};

List.propTypes = {
    onDeleteItem: PropTypes.func,
    onEditItem: PropTypes.func,
    location: PropTypes.object
};

export default List;
