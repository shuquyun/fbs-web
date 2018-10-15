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

const Jurisdiction = ({ location, dispatch, baseJurisdiction, loading }) => {
    const { query, pathname } = location;
    const {
        list,
        pagination,
        currentItem,
        modalVisible,
        modalType,
        basePermission,
        permission
    } = baseJurisdiction;

    const modalProps = {
        permission,
        basePermission,
        modalType,
        item: modalType === "create" ? {} : currentItem,
        visible: modalVisible,
        maskClosable: false,
        confirmLoading: loading.effects[`baseJurisdiction/${modalType}`],
        title: `${modalType === "create" ? "Create User" : "Update User"}`,
        wrapClassName: "vertical-center-modal",
        width: 1000,
        onOk(data) {
            console.log(data);
            dispatch({
                type: `baseJurisdiction/${modalType}`,
                payload: data
            });
        },
        onCancel() {
            dispatch({ type: "baseJurisdiction/hideModal" });
        }
    };

    const listProps = {
        dataSource: list,
        loading: loading.effects["baseJurisdiction/query"],
        pagination,
        location,
        onChange(page) {
            dispatch(
                routerRedux.push({
                    pathname,
                    query: {
                        ...query,
                        pageNo: page.current,
                        pageSize: page.pageSize
                    }
                })
            );
        },
        onDeleteItem(id) {
            dispatch({
                type: "baseJurisdiction/delete",
                payload: id
            });
        },
        onEditItem(item) {
            dispatch({
                type: "baseJurisdiction/queryPermission"
            });
            dispatch({
                type: "baseJurisdiction/showModal",
                payload: {
                    modalType: "update",
                    currentItem: item
                }
            });
        },

        changeStatus(payload) {
            dispatch({
                type: "baseJurisdiction/changeStatus",
                payload: payload
            });
        }
    };

    const filterProps = {
        onAdd() {
            dispatch({
                type: "baseJurisdiction/queryPermission"
            });
            dispatch({
                type: "baseJurisdiction/showModal",
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

Jurisdiction.propTypes = {
    baseJurisdiction: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object
};

export default connect(({ baseJurisdiction, loading }) => ({
    baseJurisdiction,
    loading
}))(Jurisdiction);
