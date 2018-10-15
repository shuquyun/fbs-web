import { routerRedux } from "dva/router";
import { login } from "./service";
import moment from "moment";
import { queryURL } from "utils";

export default {
    namespace: "login",
    state: {
        loginLoading: false,
        ctoken: moment() + Math.random()
        // userInfo:{}
    },
    effects: {
        *login({ payload }, { put, call, select }) {
            yield put({ type: "showLoginLoading" });
            let data;
            try {
                data = yield call(login, payload);
            } catch (e) {
                yield put({ type: "hideLoginLoading" });
                yield put({ type: "changeCtoken" });
                throw e;
            }
            yield put({ type: "hideLoginLoading" });
            if (data) {
                // yield put({
                //     type: "querySuccess",
                //     payload: {
                //         userInfo: data
                //     }
                // });
                yield put({ type: "app/query" });
                const from = queryURL("from");
                if (from) {
                    yield put(routerRedux.push(from));
                } else {
                    yield put(routerRedux.push("/"));
                }
            } else {
                throw data;
            }
        }
    },
    reducers: {
        showLoginLoading(state) {
            return {
                ...state,
                loginLoading: true
            };
        },
        hideLoginLoading(state) {
            return {
                ...state,
                loginLoading: false
            };
        },
        changeCtoken(state) {
            return { ...state, ctoken: moment() + Math.random() };
        }
    }
};
