import axios from 'axios'
import qs from 'qs'
import { CORS } from './config'
import jsonp from 'jsonp'
import lodash from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'

// 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
  // console.log("axios request config:",config)
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// 添加一个响应拦截器
axios.interceptors.response.use(function (response) {
  // console.log("axios response response:",response)
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

const fetch = (options) => {
  let {
    method = 'get',
    data,
    fetchType,
    url,
  } = options

  const cloneData = lodash.cloneDeep(data)

  try {
    let domin = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      domin = url.match(/[a-zA-z]+:\/\/[^/]*/)[0]
      url = url.slice(domin.length)
    }
    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domin + url
  } catch (e) {
    message.error(e.message)
  }

  if (fetchType === 'JSONP') {
    return new Promise((resolve, reject) => {
      jsonp(url, {
        param: `${qs.stringify(data)}&callback`,
        name: `jsonp_${new Date().getTime()}`,
        timeout: 4000,
      }, (error, result) => {
        if (error) {
          reject(error)
        }
        resolve({ statusText: 'OK', status: 200, data: result })
      })
    })
  }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
      })
    case 'delete':
      return axios.delete(url, {
        data: cloneData,
      })
    case 'post':
      return axios.post(url, cloneData,{})
    case 'put':
      return axios.put(url, cloneData)
    case 'patch':
      return axios.patch(url, cloneData)
    default:
      return axios(options)
  }
}

export default function request (options) {
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`
    if (window.location.origin !== origin) {
      if (CORS && CORS.indexOf(origin) > -1) {
        options.fetchType = 'CORS'
      } else {
        options.fetchType = 'JSONP'
      }
    }
  }

  return fetch(options).then((response) => {
    const { statusText, status } = response
    let data = response.data
    return data
  }).catch((error) => {
    const { response } = error
    let msg
    let statusCode
    if (response && response instanceof Object) {
      const { data, statusText } = response
      statusCode = response.status
      if(statusCode === 401){
        window.location.href = "/login"
      }else if(statusCode===403){
        msg =  data.message ||'无权限'
      }else{
        msg = data.message || statusText
      }

    } else {
      statusCode = 600
      msg = error.message || 'Network Error'
    }

    throw { success: false, statusCode, message: msg }
  })
}
