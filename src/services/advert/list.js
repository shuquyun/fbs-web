import { request, config } from 'utils'

const { api } = config
const { advertList } = api

export async function query(params){
  return request({
    url: advertList,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: advertList,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: advertList+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: advertList,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: advertList +"/" +params.id,
    method: 'get',
    data: params,
  })
}
