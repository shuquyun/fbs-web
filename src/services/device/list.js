import { request, config } from 'utils'
import qs from 'qs'

const { api } = config
const { device } = api

export async function query(params){
  return request({
    url: device,
    method: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: device,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: device+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: device,
    method: 'put',
    data: params,
  })
}

export async function queryById (params) {
  return request({
    url: device +"/" +params.id,
    method: 'get',
    data: params,
  })
}

export async function list(params){
  return request({
    url: device+"/list",
    method: 'get',
    data: params,
  })
}

export async function allot(params){
  return request({
    url: device+"/allot",
    method: 'post',
    data: qs.stringify(params),
  })
}

export async function unbinding(params){
  return request({
    url: device+"/unbinding?deviceNo="+ params.deviceNo,
    method: 'post',
  })
}

export async function cancelAllot(params){
  return request({
    url: device+"/allot/cancel?deviceNo="+ params.deviceNo,
    method: 'post',
  })
}
