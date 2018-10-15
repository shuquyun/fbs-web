/* global window */
import modelExtend from "dva-model-extend";
import { config } from "utils";
import { query, create, remove, update } from "./service";
import { pageModel } from "utils/model";
import queryString from "query-string";

const { prefix } = config;

export default modelExtend(pageModel, {
    namespace: "baseNews",

    state: {
        currentItem: {},
        modalVisible: false,
        modalType: "create",
        headerData: {}
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === "/basics/news") {
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

        *delete({ payload }, { call, put, select }) {
            const data = yield call(remove, { id: payload });
            if (data.success) {
                yield put({
                    type: "query"
                });
            } else {
                throw data;
            }
        },

        *create({ payload }, { call, put }) {
            const data = yield call(create, payload);
            if (data.success) {
                yield put({ type: "hideModal" });
                yield put({
                    type: "query"
                });
            } else {
                throw data;
            }
        },

        *update({ payload }, { select, call, put }) {
            const id = yield select(({ user }) => user.currentItem.id);
            const newUser = { ...payload, id };
            const data = yield call(update, newUser);
            if (data.success) {
                yield put({ type: "hideModal" });
                yield put({
                    type: "query"
                });
            } else {
                throw data;
            }
        }
    },

    reducers: {
        showModal(state, { payload }) {
            return { ...state, ...payload, modalVisible: true };
        },

        hideModal(state) {
            return { ...state, modalVisible: false };
        }
    }
});
