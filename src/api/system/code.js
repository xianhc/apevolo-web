import request from '@/utils/request'

export function resetEmail(data) {
  return request({
    url: 'auth/code/reset/email?email=' + data,
    method: 'post'
  })
}

export function updatePass(pass) {
  return request({
    url: 'api/users/updatePass/' + pass,
    method: 'get'
  })
}
