import React from "react";
import PropTypes from "prop-types";
import { Table, Modal } from "antd";
import classnames from "classnames";
import { DropOption } from "components";
import AnimTableBody from "components/DataTable/AnimTableBody";
import styles from "./List.less";
import { formatDate } from "utils";

const { confirm } = Modal;

const List = ({
    onDeleteItem,
    onEditItem,
    location,
    isTop,
    ...tableProps
}) => {
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
    // const deleteItemEvent = record => {
    //     confirm({
    //         title: "确定要删除当前公告吗?",
    //         onOk() {
    //             onDeleteItem(record.id);
    //         }
    //     });
    // };
    const columns = [
        {
            title: "创建时间",
            dataIndex: "createdAt",
            key: "createdAt",
            render: text => formatDate(text)
        },
        {
            title: "创建者",
            dataIndex: "userName",
            key: "userName"
        },
        {
            title: "消息内容",
            dataIndex: "content",
            key: "content"
        },

        {
            title: "操作",
            key: "operation",
            width: 100,
            render: (text, record) => {
                const menuOptions = [
                    { key: "1", name: "失效" },
                    { key: "2", name: "置顶" }
                ];
                if (ecord.status == 1 && record.isTop != null) {
                    menuOptions[1] = { key: "2", name: "取消置顶" };
                }
                if (record.status == 0) {
                    menuOptions[0] = { key: "1", name: "生效" };
                    menuOptions[1] = { key: "1", name: "删除" };
                }
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
            // render: (text, record) => (
            //     <span>
            //         {record.status == 1 &&
            //             record.isTop == null && (
            //                 <span>
            //                     <a onClick={() => updateStatus(record)}>失效</a>
            //                     &nbsp;&nbsp;|&nbsp;&nbsp;
            //                     <a onClick={() => isTop(record)}>置顶</a>
            //                 </span>
            //             )}
            //         {record.status == 1 &&
            //             record.isTop != null && (
            //                 <span>
            //                     <a onClick={() => updateStatus(record)}>失效</a>
            //                     &nbsp;&nbsp;|&nbsp;&nbsp;
            //                     <a onClick={() => isTop(record)}>取消置顶</a>
            //                 </span>
            //             )}
            //         {record.status == 0 && (
            //             <span>
            //                 <a onClick={() => updateStatus(record)}>生效</a>
            //                 &nbsp;&nbsp;|&nbsp;&nbsp;
            //                 <a onClick={() => deleteItemEvent(record)}>删除</a>
            //             </span>
            //         )}
            //     </span>
            // )
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
                body: { wrapper: AnimateBody }
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
