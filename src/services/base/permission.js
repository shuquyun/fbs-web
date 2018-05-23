import { request, config } from 'utils'

const { api } = config
const { basePermission } = api

export async function query(params){
  return request({
    url: basePermission,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: basePermission,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: basePermission+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: basePermission,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: basePermission +"/" +params.id,
    method: 'get',
    data: params,
  })
}
export async function list (params) {
  return request({
    url: basePermission+"/list",
    method: 'get',
    data: params,
  })
}

export async function menuList (params) {
  return request({
    url: basePermission+"/menu/list",
    method: 'get',
    data: params,
  })
}

