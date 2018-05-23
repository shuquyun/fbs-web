import { request, config } from 'utils'
import axios from 'axios'

const { api } = config
const { baseRole } = api

export async function query(params){
  return request({
    url: baseRole,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: baseRole,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: baseRole+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: baseRole,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: baseRole +"/" +params.id,
    method: 'get',
    data: params,
  })
}

export async function list (params) {
  return request({
    url: baseRole +"/list",
    method: 'get',
    data: params,
  })
}
