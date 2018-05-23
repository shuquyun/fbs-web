import { request, config } from 'utils'
import qs from 'qs'
const { api } = config
const { userLogin } = api

export async function login (data) {
  try {
    return request({
      url: userLogin,
      method: 'post',
      data:qs.stringify(data),
    })
  }catch (e){
    throw e
  }

}
