import { request, config } from 'utils'
import axios from 'axios'

const { api } = config
const { orderWithdraw } = api

export async function query(params){
  return request({
    url: orderWithdraw,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: orderWithdraw,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: orderWithdraw+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: orderWithdraw,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: orderWithdraw +"/" +params.id,
    method: 'get',
    data: params,
  })
}
