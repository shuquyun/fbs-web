import { request, config } from 'utils'
import qs from 'qs'

const { api } = config
const { userAdmin } = api

export async function query (params) {
  return request({
    url: userAdmin,
    method: 'get',
    data: params,
  })

}

export async function create (params) {
  return request({
    url: userAdmin,
    method: 'post',
    data: params,
  })

}

export async function update (params) {
  return request({
    url: userAdmin,
    method: 'put',
    data: params,
  })

}

export async function remove (params) {
  return request({
    url: userAdmin+ "/"+params.id,
    method: 'delete',
    data: params,
  })

}

export async function queryPayType (params) {
  return request({
    url: userAdmin+'/payType',
    method: 'get',
    data: params,
  })

}

export async function updateEdit (params) {
  return request({
    url: userAdmin,
    method: 'post',
    data: params,
  })
}


export async function disabledAgent (params) {
  return request({
    url: userAdmin,
    method: 'delete',
    data: params,
  })

}

export async function getBankData (params) {
  return request({
    url: userAdmin+'/getBank',
    method: 'get',
    data: params,
  })

}


export async function removeRate (params) {
  return request({
    url: userAdmin+'/remove/rate/:id',
    method: 'delete',
    data: params,
  })

}

export async function addRate (params) {
  return request({
    url: userAdmin+'/add/rate',
    method: 'post',
    data: params,
  })

}
export async function queryProfit (params) {
  return request({
    url: userAdmin+'/profit/:id',
    method: 'get',
    data: params,
  })

}

export async function queryProfitWithdraw (params) {
  return request({
    url: userAdmin+'/profit/withdraw',
    method: 'get',
    data: params,
  })

}

export async function queryProfitRecord (params) {
  return request({
    url: userAdmin+'/profit/record',
    method: 'get',
    data: params,
  })

}


export async function add (params) {
  return request({
    url: userAdmin+"/add",
    method: 'post',
    data: params,
  })

}

export async function updateStatus (params) {
  return request({
    url: userAdmin+"/update/status?"+qs.stringify(params),
    method: 'put',
  })
}
