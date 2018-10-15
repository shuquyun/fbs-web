import { request, config } from "utils";

const { api } = config;
const { user, userLogout, userLogin, adminPermission, menus, auth } = api;

export function login(params) {
    return request({
        url: userLogin,
        method: "post",
        data: params
    });
}

export function logout(params) {
    return request({
        url: userLogout,
        method: "get",
        data: params
    });
}

export function query(params) {
    return request({
        url: user,
        method: "get",
        data: params
    });
}
export async function menuList(params) {
    return request({
        url: menus,
        method: "get",
        data: params
    });
}

export async function sendSms(params) {
    return request({
        url: auth + "/sendSms",
        method: "post",
        data: params
    });
}

export async function forgot(params) {
    return request({
        url: auth + "/forgot",
        method: "post",
        data: params
    });
}

export async function update(params) {
    return request({
        url: auth + "/update",
        method: "post",
        data: params
    });
}

export async function updatePassword(params) {
    return request({
        url: auth + "/update/password",
        method: "post",
        data: qs.stringify(params)
    });
}
