export function getToken() {
  return window.localStorage.getItem('x-token')
}

export function getTokenExpire() {
  return window.localStorage.getItem('token_expire')
}

export function getRefreshTokenExpires() {
  return window.localStorage.getItem('refresh_token_expires')
}

export function getTokenType() {
  return window.localStorage.getItem('token_type')
}

export function getExpiresIn() {
  return window.localStorage.getItem('expires_in')
}

export function setToken(token) {
  window.localStorage.setItem('x-token', token.access_token)
  const curTime = new Date()
  window.localStorage.token_expire = new Date(curTime.setSeconds(curTime.getSeconds() + token.expires_in))
  window.localStorage.refresh_token_expires = new Date(curTime.setSeconds(curTime.getSeconds() + token.refresh_token_expires_in))
  window.localStorage.setItem('expires_in', token.expires_in)
  window.localStorage.setItem('refresh_token_expires_in', token.refresh_token_expires_in)
  window.localStorage.setItem('token_type', token.token_type)
}

