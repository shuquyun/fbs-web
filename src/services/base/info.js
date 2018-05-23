import { request, config } from 'utils'
import axios from 'axios'

const { api } = config
const { ucUser,auth } = api

export async function query(params){
  return request({
    url: ucUser,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: ucUser,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: ucUser+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: ucUser+"/update",
    method: 'put',
    data: params,
  })
}


export async function queryUserInfo (params) {
  return request({
    url: auth + '/user',
    method: 'get',
    data: params,
  })
}

