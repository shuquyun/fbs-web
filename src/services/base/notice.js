import { request, config } from 'utils'
import axios from 'axios'

const { api } = config
const { baseNotice } = api

export async function query(params){
  return request({
    url: baseNotice,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: baseNotice,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: baseNotice+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: baseNotice,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: baseNotice +"/" +params.id,
    method: 'get',
    data: params,
  })
}
