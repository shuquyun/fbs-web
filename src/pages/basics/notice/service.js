import { request, config } from "utils";

const { api } = config;
const { baseNotice } = api;

export function query(params) {
    return request({
        url: baseNotice,
        method: "get",
        data: params
    });
}

export function create(params) {
    return request({
        url: baseNotice + "/addAdminInfo",
        method: "post",
        data: params
    });
}

export function remove(params) {
    return request({
        url: baseNotice,
        method: "delete",
        data: params
    });
}

export function update(params) {
    return request({
        url: baseNotice,
        method: "patch",
        data: params
    });
}
