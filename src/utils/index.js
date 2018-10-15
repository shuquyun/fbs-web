/* global window */
import cloneDeep from "lodash.clonedeep";

import classnames from "classnames";
import config from "./config";
import request from "./request";
import { color } from "./theme";
import moment from "moment";
export { classnames, config, request };

// export classnames from 'classnames'
// export config from './config'
// export request from './request'
export { color } from "./theme";

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
    return this.replace(/-(\w)/g, (...args) => {
        return args[1].toUpperCase();
    });
};

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
    return this.replace(/([A-Z])/g, "-$1").toLowerCase();
};

// 日期格式化
Date.prototype.format = function (format) {
    const o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(
            RegExp.$1,
            `${this.getFullYear()}`.substr(4 - RegExp.$1.length)
        );
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(format)) {
            format = format.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? o[k]
                    : `00${o[k]}`.substr(`${o[k]}`.length)
            );
        }
    }
    return format;
};

//格式化日期,如果为空则返回空
export const formatDate = (date, str) => {
    if (!date) {
        return "";
    }
    return moment(date).format(str ? str : "YYYY-MM-DD HH:mm:ss");
};

/**
 * @param  name {String}
 * @return  {String}
 */
export function queryURL(name) {
    let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
export function queryArray(array, key, keyAlias = "key") {
    if (!(array instanceof Array)) {
        return null;
    }
    const item = array.filter(_ => _[keyAlias] === key);
    if (item.length) {
        return item[0];
    }
    return null;
}

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
export function arrayToTree(
    array,
    id = "id",
    pid = "pid",
    children = "children"
) {
    let data = cloneDeep(array);
    let result = [];
    let hash = {};
    data.forEach((item, index) => {
        hash[data[index][id]] = data[index];
    });

    data.forEach(item => {
        let hashVP = hash[item[pid]];
        if (hashVP) {
            !hashVP[children] && (hashVP[children] = []);
            hashVP[children].push(item);
        } else {
            result.push(item);
        }
    });
    return result;
}

/**
 *
 * 对象深拷贝
 */
export const deepClone = obj => {
    var proto = Object.getPrototypeOf(obj);
    return Object.assign({}, Object.create(proto), obj);
};


/**
 * 隐藏手机号中间四位数
 * @param {*} mobile 
 */
export const hiddenMobile = mobile => {
    if (typeof (mobile) === 'string') {
        let str = mobile.substr(0, 3) + "****" + mobile.substr(7)
        return str
    } else {
        return mobile
    }
}