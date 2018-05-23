import { request, config } from 'utils'

const { api } = config
const { adDevice } = api

export async function query(params){
  return request({
    url: adDevice,
    type: 'get',
    data: params,
  })
}

export async function create (params) {
  return request({
    url: adDevice,
    method: 'post',
    data: params,
  })
}

export async function remove (params) {
  return request({
    url: adDevice+"/" +params.id,
    method: 'delete',
  })
}

export async function update (params) {
  return request({
    url: adDevice,
    method: 'put',
    data: params,
  })
}
export async function push (params) {
  return request({
    url: adDevice+"/push?packageId="+params.id,
    method: 'post',
  })
}

export async function pushAgain (params) {
  return request({
    url: adDevice+"/push/again?id="+params.id,
    method: 'post',
  })
}

export async function queryById (params) {
  return request({
    url: adDevice +"/" +params.id,
    method: 'get',
    data: params,
  })
}
