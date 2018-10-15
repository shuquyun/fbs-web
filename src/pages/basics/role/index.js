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
import PermissionModal from "./components/PermissionModal";
const Role = ({ location, dispatch, baseRole, loading }) => {
    const { query, pathname } = location;
    const {
        list,
        pagination,
        currentItem,
        modalVisible,
        modalType,
        menuList,
        permission
    } = baseRole;

    
    const permissionModalProps = {
        permission,
        item: permission.currentItem,
        visible: permission.modalVisible,
        maskClosable: false,
        title: "权限分配",
        wrapClassName: "vertical-center-modal",
        width: 1000,
        onCancel() {
            dispatch({ type: "baseRole/hidePermissionModal" });
        },
        onOk(item) {
            dispatch({
                type: `baseRole/updatePermission`,
                payload: { ...item }
            });
        },
        changeCheckedKeys(data) {
            dispatch({
                type: "baseRole/queryPermissionSuccess",
                payload: data
            });
        }
    };
    const modalProps = {
        menuList,
        modalType,
        item: modalType === "create" ? {} : currentItem,
        visible: modalVisible,
        maskClosable: false,
        confirmLoading: loading.effects[`baseJurisdiction/${modalType}`],
        title: `${modalType === "create" ? "Create User" : "Update User"}`,
        wrapClassName: "vertical-center-modal",
        width: "60%",
        onOk(data) {
            dispatch({
                type: `baseRole/${modalType}`,
                payload: data
            })
        },
        onCancel() {
            dispatch({ type: "baseRole/hideModal" });
        }
    };

    const listProps = {
        dataSource: list,
        loading: loading.effects["baseRole/query"],
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
            dispatch({ type: "baseRole/delete", payload: id })
        },
        onEditItem(item) {
            dispatch({
                type: "baseRole/showModal",
                payload: {
                    modalType: "update",
                    currentItem: item
                }
            });
        },
        onAllotItem(item) {
            dispatch({
                type: "baseRole/getMenuAndShowPermissionModal",
                payload: { currentItem: item }
            });
        }
    };

    const filterProps = {
        onAdd() {
            dispatch({
                type: "baseRole/showModal",
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
            {permission.modalVisible && (
                <PermissionModal {...permissionModalProps} />
            )}
        </Page>
    );
};

Role.propTypes = {
    baseRole: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object
};

export default connect(({ baseRole, loading }) => ({
    baseRole,
    loading
}))(Role);
