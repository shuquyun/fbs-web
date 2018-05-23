import { request, config } from 'utils'

const { api } = config
const { baseBizPermission } = api

export async function query(params){
  return request({
    url: baseBizPermission,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: baseBizPermission,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: baseBizPermission+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: baseBizPermission,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: baseBizPermission +"/" +params.id,
    method: 'get',
    data: params,
  })
}

export async function list (params) {
  return request({
    url: baseBizPermission +"/list",
    method: 'get',
    data: params,
  })
}

export async function menuList (params) {
  return request({
    url: baseBizPermission +"/menu/list",
    method: 'get',
    data: params,
  })
}
