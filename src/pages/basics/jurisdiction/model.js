/* global window */
import modelExtend from "dva-model-extend";
import { config } from "utils";
import {
    create,
    remove,
    update,
    query,
    queryPermission,
} from "./service";
import { pageModel } from "utils/model";
import { message } from "antd";
import queryString from "query-string";

const { prefix } = config;

export default modelExtend(pageModel, {
    namespace: "baseJurisdiction",

    state: {
        currentItem: {},
        modalVisible: false,
        basePermission: [], //菜单
        modalType: "create",
        permission: {
            menuList: [],
            checkedKeys: ["1"]
        }
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === "/basics/jurisdiction") {
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
                            total: data.result.total
                        }
                    }
                });
            }
        },

        *delete({ payload }, { call, put }) {
            const data = yield call(remove, { id: payload });
            if (data) {
                yield put({
                    type: "query"
                });
            } else {
                throw data;
            }
        },

        *create({ payload }, { call, put }) {
            const data = yield call(create, payload);
            if (data) {
                message.success("添加用户权限成功");
                yield put({ type: "hideModal" });
                yield put({ type: "query" });
            } else {
                throw data;
            }
        },

        *update({ payload }, { call, put }) {
            const data = yield call(update, payload);
            if (data) {
                message.success("修改权限成功");
                yield put({ type: "hideModal" });
                yield put({ type: "query" });
            } else {
                throw data;
            }
        },

        *queryPermission({ payload }, { call, put }) {
            const dataPermission = yield call(queryPermission, payload);
            if (dataPermission) {
                yield put({
                    type: "queryPermissionSuccess",
                    payload: {
                        menuList: dataPermission
                    }
                });
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
        switchIsMotion(state) {
            window.localStorage.setItem(
                `${prefix}userIsMotion`,
                !state.isMotion
            );
            return { ...state, isMotion: !state.isMotion };
        },
        showCodeModal(state, { payload }) {
            return { ...state, ...payload, codeModalVisible: true };
        },

        hideCodeModal(state) {
            return { ...state, codeModalVisible: false };
        }
    }
});
