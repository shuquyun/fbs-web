import { request, config } from 'utils'
import axios from 'axios'

const { api } = config
const { productCategory } = api

export async function query(params){
  return request({
    url: productCategory,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: productCategory,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: productCategory+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: productCategory,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: productCategory +"/" +params.id,
    method: 'get',
    data: params,
  })
}

export async function systemUnit (params) {
  return request({
    url: productCategory +"/unit/list",
    method: 'get',
    data: params,
  })
}

export async function list (params) {
  return request({
    url: productCategory +"/list",
    method: 'get',
    data: params,
  })
}

