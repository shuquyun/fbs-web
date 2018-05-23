import { request, config } from 'utils'

const { api } = config
const { baseSalaryPermission } = api

export async function query(params){
  return request({
    url: baseSalaryPermission,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: baseSalaryPermission,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: baseSalaryPermission+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: baseSalaryPermission,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: baseSalaryPermission +"/" +params.id,
    method: 'get',
    data: params,
  })
}

export async function list (params) {
  return request({
    url: baseSalaryPermission +"/list",
    method: 'get',
    data: params,
  })
}

export async function menuList (params) {
  return request({
    url: baseSalaryPermission +"/menu/list",
    method: 'get',
    data: params,
  })
}
