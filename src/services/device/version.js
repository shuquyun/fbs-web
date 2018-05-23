import { request, config } from 'utils'
import axios from 'axios'

const { api } = config
const { deviceVersion } = api

export async function query(params){
  return request({
    url: deviceVersion,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: deviceVersion,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: deviceVersion+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: deviceVersion,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: deviceVersion +"/" +params.id,
    method: 'get',
    data: params,
  })
}
