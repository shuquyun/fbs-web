import { request, config } from 'utils'
import qs from 'qs'

const { api } = config
const { productModel } = api

export async function query(params){
  return request({
    url: productModel,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: productModel,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: productModel+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: productModel,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: productModel +"/" +params.id,
    method: 'get',
    data: params,
  })
}

export async function updateStatus (params) {
  return request({
    url: productModel+"/update/status",
    method: 'post',
    data: qs.stringify(params),
  })
}
