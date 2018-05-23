import { request, config } from 'utils'
import axios from 'axios'
import qs from 'qs'

const { api } = config
const { rolePermission } = api

export async function query(params){
  return request({
    url: rolePermission,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: rolePermission,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: rolePermission+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: rolePermission,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: rolePermission +"/" +params.id,
    method: 'get',
    data: params,
  })
}

export async function list (params) {
  return request({
    url: rolePermission +"/list",
    method: 'get',
    data: params,
  })
}

export async function updatePermission (params) {
  return request({
    url: rolePermission+"/update",
    method: 'post',
    data: qs.stringify(params),
  })
}
