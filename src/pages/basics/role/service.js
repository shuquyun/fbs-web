import { request, config } from "utils";
import qs from "qs";

const { api } = config;
const { adminRole, adminRolePermission } = api;

export function query(params) {
    return request({ url: adminRole, method: "get", data: params });
}

export function remove(params) {
    return request({
        url: adminRole + "/" + params.id,
        method: "delete",
        data: params
    });
}

export function update(params) {
    console.log(123444);
    return request({ url: adminRole, method: "put", data: params });
}

export async function queryPersonPermission(params) {
    return request({
        url: adminRolePermission + "/list",
        method: "get",
        data: params
    });
}
export async function updatePermission(params) {
    return request({
        url: `${adminRolePermission}/update?roleId=${
            params.roleId
        }&permissionIdList=${params.permissionIdList}`,
        method: "post"
        // data: params
    });
}

export async function create(params) {
    return request({
        url: adminRole,
        method: "post",
        data: params
    });
}
