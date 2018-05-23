import { request, config } from 'utils'

const { api } = config
const { adPackage } = api

export async function query(params){
  return request({
    url: adPackage,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: adPackage,
    method: 'post',
    data: params,
  })
}

export async function copy (params) {
  return request({
    url: adPackage+"/clone?id="+params.id,
    method: 'post',
  })
}

export async function remove (params) {
  return request({
    url: adPackage+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: adPackage,
    method: 'put',
    data: params,
  })
}


export async function queryById (params) {
  return request({
    url: adPackage +"/" +params.id,
    method: 'get',
    data: params,
  })
}
