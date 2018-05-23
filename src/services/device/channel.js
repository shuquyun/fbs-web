import { request, config } from 'utils'
import axios from 'axios'

const { api } = config
const { deviceChannel } = api

export async function query(params){
  return request({
    url: deviceChannel,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: deviceChannel,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: deviceChannel+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: deviceChannel,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: deviceChannel +"/" +params.id,
    method: 'get',
    data: params,
  })
}

export async function list (params) {
  return request({
    url: `${deviceChannel}/${params.deviceId}/list`,
    method: 'get',
    data: params,
  })
}
