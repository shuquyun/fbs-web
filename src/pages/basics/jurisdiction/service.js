import { request, config } from "utils";
import qs from "qs";

const { api } = config;
const { user, adminPermission } = api;

export function query(params) {
    return request({ url: adminPermission, method: "get", data: params });
}

export function remove(params) {
    return request({
        url: adminPermission + "/" + params.id,
        method: "delete",
        data: params
    });
}

export function update(params) {
    console.log(params);
    return request({ url: adminPermission, method: "put", data: params });
}

//获取基础设置--用户设置--用户角色
export async function queryPermission(params) {
    return request({
        url: `${adminPermission}/menu/list`,
        method: "get",
        data: params
    });
}

//添加权限
export async function create(params) {
    return request({
        url: adminPermission,
        method: "post",
        data: params
    });
}
