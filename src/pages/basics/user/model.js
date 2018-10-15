/* global window */
import modelExtend from "dva-model-extend";
import {
    query,
    create,
    remove,
    update,
    queryRoleInfo,
    changeStatus,
    updateCode
} from "./service";
import { pageModel } from "utils/model";
import { message } from "antd";
import queryString from "query-string";


export default modelExtend(pageModel, {
    namespace: "baseUser",

    state: {
        currentItem: [],
        modalVisible: false,
        modalType: "create",
        selectedRowKeys: [],
        baseRole: []
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === "/basics/user") {
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
                // console.log(data);
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

        *delete({ payload }, { call, put, select }) {
            const data = yield call(remove, { id: payload });
            if (data) {
                yield put({ type: "query" });
            } else {
                throw data;
            }
        },

        *create({ payload }, { call, put }) {
            const data = yield call(create, payload);
            if (data) {
                yield put({ type: "hideModal" });
                yield put({ type: "query" });
            } else {
                throw data;
            }
        },

        *update({ payload }, { select, call, put }) {
            console.log("update");
            const data = yield call(update, payload);
            if (data) {
                message.success("修改成功");
                yield put({ type: "hideModal" });
                yield put({ type: "query" });
            } else {
                throw data;
            }
        },
        //重置密码
        *updateCode({ payload }, { call, put }) {
            const data = yield call(updateCode, payload);
            if (data) {
                message.success("重置密码成功");
                yield put({ type: "hideCodeModal" });
                // yield put({ type: 'query' })
            } else {
                throw data;
            }
        },
        //修改状态
        *changeStatus({ payload }, { call, put }) {
            const data = yield call(changeStatus, payload);
            if (data) {
                message.success("用户状态已修改");
                yield put({ type: "query" });
            } else {
                throw data;
            }
        },
        //获取角色列表
        *queryRoleInfo({ payload }, { call, put }) {
            yield put({
                type: "showModal"
            });
            console.log(payload);
            const dataRole = yield call(queryRoleInfo, payload);
            if (dataRole) {
                yield put({
                    type: "updateState",
                    payload: {
                        baseRole: dataRole
                    }
                });
            }
        }
    },

    reducers: {
        showModal(state, { payload }) {
            return { ...state, ...payload, modalVisible: true };
        },

        hideModal(state) {
            return { ...state, modalVisible: false };
        },
        showCodeModal(state, { payload }) {
            return { ...state, ...payload, codeModalVisible: true };
        },

        hideCodeModal(state) {
            return { ...state, codeModalVisible: false };
        }
    }
});
