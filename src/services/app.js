import { request, config } from 'utils'
import qs from 'qs'

const { api } = config
const { auth  , userLogout, userLogin } = api

export async function login (params) {
  return request({
    url: userLogin,
    method: 'post',
    data: params,
  })
}

export async function logout (params) {
  return request({
    url: userLogout,
    method: 'get',
    data: params,
  })
}

export async function query (params) {
  return request({
    url: auth + '/user',
    method: 'get',
    data: params,
  })
}

export async function sendSms (params) {
  return request({
    url: auth + '/sendSms',
    method: 'post',
    data: params,
  })
}
export async function forgot (params) {
  return request({
    url: auth +'/forgot',
    method: 'post',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: auth +'/update',
    method: 'post',
    data: params,
  })
}

export async function updatePassword (params) {
  return request({
    url: auth +'/update/password',
    method: 'post',
    data: qs.stringify(params),
  })
}
