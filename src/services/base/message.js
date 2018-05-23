import { request, config } from 'utils'
import axios from 'axios'
import qs from 'qs'

const { api } = config
const { baseMessage } = api

export async function query(params){
  return request({
    url: baseMessage,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: baseMessage,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: baseMessage+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: baseMessage,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: baseMessage +"/" +params.id,
    method: 'get',
    data: params,
  })
}

export async function updateStatus(params){
  return request({
    url: baseMessage+"/update/status?"+ qs.stringify(params),
    method: 'put',
  })
}

export async function read(params){
  return request({
    url: baseMessage+"/read?"+ qs.stringify(params),
    method: 'put',
  })
}
