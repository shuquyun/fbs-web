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
import CodeModal from "./components/CodeModal";

const User = ({ location, dispatch, baseUser, loading }) => {
    const { query, pathname } = location;
    const {
        currentItem,
        modalVisible,
        modalType,
        baseRole,
        codeModalVisible,
        confirmDirty,
        list
    } = baseUser;
    //查询角色列表
    console.log(baseRole);
    const queryRole = () => {
        dispatch({
            type: "baseUser/queryRoleInfo"
        });
    };
    
    const modalProps = {
        modalType,
        item: modalType === "create" ? {} : currentItem,
        visible: modalVisible,
        maskClosable: false,
        confirmLoading: loading.effects[`baseJurisdiction/${modalType}`],
        title: `${modalType === "create" ? "Create User" : "Update User"}`,
        wrapClassName: "vertical-center-modal",
        baseRole,
        width: 1000,
        onOk(data) {
            dispatch({
                type: `baseUser/${modalType}`,
                payload: data
            });
        },
        onCancel() {
            dispatch({ type: "baseUser/hideModal" });
        }
    };

    const listProps = {
        dataSource: list,
        loading: loading.effects["baseUser/query"],
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
            dispatch({ type: "baseUser/delete", payload: id });
        },
        onEditItem(item) {
            console.log(123);
            queryRole();
            dispatch({
                type: "baseUser/showModal",
                payload: {
                    modalType: "update",
                    currentItem: item
                }
            });
        },
        onEditCode(item) {
            dispatch({
                type: "baseUser/showCodeModal",
                payload: {
                    currentItem: item
                }
            });
        },
        changeStatus(payload) {
            dispatch({ type: "baseUser/changeStatus", payload: payload });
        }
    };

    const filterProps = {
        onAdd() {
            // dispatch({
            //     type: "baseUser/showModal",
            //     payload: {
            //         modalType: "create"
            //     }
            // });
            dispatch({
                type: "baseUser/queryRoleInfo"
            });
        }
    };
    const codeModalProps = {
        confirmDirty,
        visible: codeModalVisible,
        maskClosable: false,
        item: currentItem,
        onCancel() {
            dispatch({ type: "baseUser/hideCodeModal" });
        },
        changeConfirmDirty(payload) {
            dispatch({
                type: "baseUser/querySuccess",
                payload: payload
            });
        },
        onOk(item, password) {
            dispatch({
                type: "baseUser/updateCode",
                payload: {
                    uid: item.uid,
                    password
                }
            });
        }
    };
    return (
        <Page inner>
            <Filter {...filterProps} />
            <List {...listProps} />
            {modalVisible && <Modal {...modalProps} />}
            {codeModalVisible && <CodeModal {...codeModalProps} />}
        </Page>
    );
};

User.propTypes = {
    baseJurisdiction: PropTypes.object,
    location: PropTypes.object,
    dispatch: PropTypes.func,
    loading: PropTypes.object
};

export default connect(({ baseUser, loading }) => ({
    baseUser,
    loading
}))(User);
