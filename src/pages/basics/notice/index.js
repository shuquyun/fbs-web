import React from "react";
import PropTypes from "prop-types";
import { routerRedux } from "dva/router";
import { connect } from "dva";
import { Row, Col, Button, Popconfirm } from "antd";
import { Page } from "components";
import queryString from "query-string";
import List from "./components/List";
import Filter from "./components/Filter";
import Modal from "./components/Modal";

const Notice = ({ location, dispatch, baseNotice, loading }) => {
    const { query, pathname } = location;
    const {
        list,
        pagination,
        currentItem,
        modalVisible,
        modalType
    } = baseNotice;

    

    const modalProps = {
        item: currentItem,
        visible: modalVisible,
        maskClosable: false,
        title: `${modalType === "create" ? "新建公告" : "修改公告"}`,
        wrapClassName: "vertical-center-modal",
        width: 1000,
        onCancel() {
            dispatch({
                type: "baseNotice/hideModal"
            });
        },
        onOk(item) {
            dispatch({
                type: `baseNotice/${modalType}`,
                payload: { ...item }
            });
        }
    };

    const listProps = {
        dataSource: list,
        loading: loading.effects["baseNotice/query"],
        pagination,
        location,
        onChange(page) {
            dispatch(routerRedux.push({
                pathname,
                query: {
                    ...query,
                    pageNo: page.current,
                    pageSize: page.pageSize,
                },
            }))
        },
        onDeleteItem(id) {
            dispatch({
                type: "baseNotice/delete",
                payload: id
            })
        },
        onEditItem(item) {
            dispatch({
                type: "baseNotice/showModal",
                payload: {
                    modalType: "update",
                    currentItem: item
                }
            });
        },
        updateStatus(item) {
            let status = !item.status ? 1 : 0;
            dispatch({
                type: "baseNotice/updateStatus",
                payload: {
                    id: item.id,
                    status: status
                }
            });
        },
        isTop(item) {
            let isTop = 0;
            if (item.isTop == 0) {
                isTop = 1;
            }
            dispatch({
                type: "baseNotice/updateTop",
                payload: {
                    id: item.id,
                    isTop: isTop
                }
            });
        }
    };

    const filterProps = {
        onAdd() {
            dispatch({
                type: "baseNotice/showModal",
                payload: {
                    modalType: "create"
                }
            });
        }
    };

    return (
        <Page inner>
            <Filter {...filterProps} />

            <List {...listProps} />
            {modalVisible && <Modal {...modalProps} />}
        </Page>
    );
};

Notice.propTypes = {
    baseNotice: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object
};

export default connect(({ baseNotice, loading }) => ({ baseNotice, loading }))(
    Notice
);
