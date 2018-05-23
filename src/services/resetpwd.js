import { request, config } from 'utils'
import qs from 'qs'
const { api } = config
const { userResetpwd, codeMobile} = api

export async function resetpwd (data) {
  try {
    return request({
      url: userResetpwd,
      method: 'post',
      data: qs.stringify(data),
    })
  }catch (e){
    throw e
  }

}
export async function sendMsg (data) {
  return request({
    url: codeMobile+"?"+qs.stringify(data),
    method: 'get',
  })
}
