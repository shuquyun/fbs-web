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

const News = ({ location, dispatch, baseNews, loading }) => {
    const { query, pathname } = location;
    const { list, pagination, currentItem, modalVisible, modalType } = baseNews;

    
    const filterProps = {
        onAdd() {
            dispatch({
                type: "baseNews/showModal",
                payload: {
                    modalType: "create"
                }
            });
        }
    };
    const modalProps = {
        item: currentItem,
        visible: modalVisible,
        maskClosable: false,
        title: `${modalType === "create" ? "新建公告" : "修改公告"}`,
        wrapClassName: "vertical-center-modal",
        width: 1000,
        onCancel() {
            dispatch({ type: "baseNews/hideModal" });
        },
        onOk(item) {
            dispatch({
                type: `baseNews/${modalType}`,
                payload: { ...item }
            });
        }
    };
    const listProps = {
        dataSource: list,
        loading: loading.effects["baseNews/query"],
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
                type: "baseNews/delete",
                payload: id
            })
        },
        onEditItem(item) {
            dispatch({
                type: "baseNews/showModal",
                payload: {
                    modalType: "update",
                    currentItem: item
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

News.propTypes = {
    baseNews: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object
};

export default connect(({ baseNews, loading }) => ({ baseNews, loading }))(
    News
);
