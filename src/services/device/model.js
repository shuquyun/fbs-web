import { request, config } from 'utils'
import axios from 'axios'

const { api } = config
const { deviceModel } = api

export async function query(params){
  return request({
    url: deviceModel,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: deviceModel,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: deviceModel+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: deviceModel,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: deviceModel +"/" +params.id,
    method: 'get',
    data: params,
  })
}

export async function list (params) {
  return request({
    url: deviceModel +"/list",
    method: 'get',
    data: params,
  })
}
