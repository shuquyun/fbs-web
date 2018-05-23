import { request, config } from 'utils'
import axios from 'axios'

const { api } = config
const { baseAgentPermission } = api

export async function query(params){
  return request({
    url: baseAgentPermission,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: baseAgentPermission,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: baseAgentPermission+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: baseAgentPermission,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: baseAgentPermission +"/" +params.id,
    method: 'get',
    data: params,
  })
}

export async function list (params) {
  return request({
    url: baseAgentPermission +"/list",
    method: 'get',
    data: params,
  })
}

export async function menuList (params) {
  return request({
    url: baseAgentPermission +"/menu/list",
    method: 'get',
    data: params,
  })
}

