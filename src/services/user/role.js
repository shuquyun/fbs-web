import { request, config } from 'utils'
import axios from 'axios'

const { api } = config
const { userRole } = api

export async function query(params){
  return request({
    url: userRole,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: userRole+'/save',
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: userRole+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: userRole,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: userRole +"/" +params.id,
    method: 'get',
    data: params,
  })
}
