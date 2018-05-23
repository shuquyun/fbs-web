import { request, config } from 'utils'

const { api } = config
const { ucUser } = api

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
    url: ucUser,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: ucUser +"/" +params.id,
    method: 'get',
    data: params,
  })
}
