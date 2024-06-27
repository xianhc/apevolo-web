import request from '@/utils/request'

export function resetEmail(data) {
  return request({
    url: 'auth/code/reset/email?email=' + data,
    method: 'post'
  })
}

export function getLoginCaptcha() {
  return request({
    url: 'auth/captcha',
    method: 'get'
  })
}
