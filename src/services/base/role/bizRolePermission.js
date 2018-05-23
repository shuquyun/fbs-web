import { request, config } from 'utils'
import axios from 'axios'
import qs from 'qs'

const { api } = config
const { baseBizRolePermission } = api

export async function query(params){
  return request({
    url: baseBizRolePermission,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: baseBizRolePermission,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: baseBizRolePermission+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: baseBizRolePermission,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: baseBizRolePermission +"/" +params.id,
    method: 'get',
    data: params,
  })
}

export async function list (params) {
  return request({
    url: baseBizRolePermission +"/list",
    method: 'get',
    data: params,
  })
}

export async function updatePermission (params) {
  return request({
    url: baseBizRolePermission+"/update",
    method: 'post',
    data: qs.stringify(params),
  })
}
