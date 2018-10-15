/* global window */
import modelExtend from "dva-model-extend";
import { config } from "utils";
import {
    create,
    remove,
    update,
    query,
    queryPersonPermission,
    queryRoleInfo,
    queryAllPermission,
    updatePermission
} from "./service";
import { pageModel } from "utils/model";
import { message } from "antd";
import queryString from "query-string";

const { prefix } = config;

export default modelExtend(pageModel, {
    namespace: "baseRole",
    state: {
        currentItem: {},
        modalVisible: false,
        allotModalVisible: false,
        baseRole: [], //用户角色
        modalType: "create",
        permission: {
            currentItem: {},
            menuList: [],
            modalVisible: false,
            checkedKeys: ["1"]
        }
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === "/basics/role") {
                    const payload = location.query || { page: 1, pageSize: 10 };
                    dispatch({
                        type: "query",
                        payload
                    });
                }
            });
        }
    },

    effects: {
        *query({ payload = {} }, { call, put }) {
            if (!payload.pageNo) {
                payload = { ...payload, ...queryString.parse(location.search) };
            }
            const data = yield call(query, payload);
            if (data) {
                yield put({
                    type: "querySuccess",
                    payload: {
                        list: data.result.data,
                        pagination: {
                            current: Number(payload.pageNo) || 1,
                            pageSize: Number(payload.pageSize) || 10,
                            total: data.total
                        }
                    }
                });
            }
        },

        *delete({ payload }, { call, put }) {
            const data = yield call(remove, { id: payload });
            if (data) {
                yield put({ type: "query" });
            } else {
                throw data;
            }
        },

        *create({ payload }, { call, put }) {
            const data = yield call(create, payload);
            if (data.success) {
                message.success("添加管理员成功");
                yield put({ type: "hideModal" });
                yield put({ type: "query" });
            } else {
                throw data;
            }
        },

        *update({ payload }, { select, call, put }) {
            const data = yield call(update, payload);
            if (data) {
                message.success("修改角色成功");
                yield put({ type: "hideModal" });
                yield put({ type: "query" });
            } else {
                throw data;
            }
        },

        //获取角色列表
        *queryRoleInfo({ payload }, { call, put }) {
            const dataRole = yield call(queryRoleInfo, payload);
            if (dataRole) {
                yield put({
                    type: "querySuccess",
                    payload: { baseRole: dataRole.list }
                });
            }
        },

        //获取所有权限列表
        *queryAllPermission({ payload }, { call, put }) {
            const menuList = yield call(queryAllPermission, payload);
            if (menuList) {
                yield put({
                    type: "queryPermissionSuccess",
                    payload: { menuList: menuList.list }
                });
            }
        },

        *getMenuAndShowPermissionModal({ payload = {} }, { call, put }) {
            const data = yield call(queryPersonPermission, {
                roleId: payload.currentItem.id
            });
            yield put({
                type: "showPermissionModal",
                payload: {
                    ...payload,
                    menuList: data.systemPermissionList,
                    checkedKeys: data.permissionIdList
                }
            });
        },
        *updatePermission({ payload }, { select, call, put }) {
            const data = yield call(updatePermission, payload);
            if (data) {
                yield put({ type: "hidePermissionModal" });
                yield put({ type: "query" });
            } else {
                throw data;
            }
        }
    },

    reducers: {
        //修改权限列表数据
        queryPermissionSuccess(state, { payload }) {
            return {
                ...state,
                permission: { ...state.permission, ...payload }
            };
        },
        showModal(state, { payload }) {
            return { ...state, ...payload, modalVisible: true };
        },

        hideModal(state) {
            return { ...state, modalVisible: false };
        },
        
        showPermissionModal(state, { payload }) {
            return {
                ...state,
                permission: {
                    ...state.permissions,
                    ...payload,
                    modalVisible: true
                }
            };
        },

        hidePermissionModal(state) {
            return {
                ...state,
                permission: {
                    ...state.permissions,
                    currentItem: {},
                    menuList: [],
                    checkedKeys: [],
                    modalVisible: false
                }
            };
        }
    }
});
