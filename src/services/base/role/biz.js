import { request, config } from 'utils'
import axios from 'axios'

const { api } = config
const { baseBizRole } = api

export async function query(params){
  return request({
    url: baseBizRole,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: baseBizRole,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: baseBizRole+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: baseBizRole,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: baseBizRole +"/" +params.id,
    method: 'get',
    data: params,
  })
}
