import request from '@/utils/request'

export function login(username, password, captcha, captchaId) {
  return request({
    url: 'auth/login',
    method: 'post',
    data: {
      username,
      password,
      captcha,
      captchaId
    }
  })
}

export function getInfo() {
  return request({
    url: 'auth/info',
    method: 'get'
  })
}

export function getCaptcha() {
  return request({
    url: 'auth/captcha',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: 'auth/logout',
    method: 'delete'
  })
}
