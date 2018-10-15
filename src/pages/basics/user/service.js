import { request, config } from "utils";
import qs from "qs";

const { api } = config;
const { baseUser, getUser, baseSettingRole } = api;

export function query(params) {
    return request({ url: getUser, method: "get", data: params });
}

//添加用户
export async function create(params) {
    return request({
        url: getUser,
        method: "post",
        data: params
    });
}
//删除用户
export function remove(params) {
    return request({
        url: getUser + "/" + params.id,
        method: "delete",
        data: params
    });
}
//   编辑
export function update(params) {
    return request({ url: getUser, method: "put", data: params });
}
//获取基础设置--用户设置--用户角色
export async function queryRoleInfo(params) {
    return request({
        url: baseSettingRole,
        method: "get",
        data: params
    });
}
//重置密码
export async function updateCode(params) {
    return request({
        url: `${getUser}/retPwd?uid=${params.uid}&pwd=${params.password}`,
        method: "put"
    });
}
//修改用户状态
export async function changeStatus(params) {
    return request({
        url: `${getUser}/update/status/${params.id}?status=${params.status}`,
        method: "put"
    });
}
