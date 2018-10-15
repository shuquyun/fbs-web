import { request, config } from "utils";

const { api } = config;
const { userMessage } = api;

export function query(params) {
    return request({ url: userMessage, method: "get", data: params });
}

export function create(params) {
    return request({ url: userMessage, method: "post", data: params });
}

export function remove(params) {
    return request({ url: userMessage, method: "delete", data: params });
}

export function update(params) {
    return request({ url: userMessage, method: "put", data: params });
}
