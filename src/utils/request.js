import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getRefreshTokenExpires, getToken, getTokenExpire, getTokenType, setToken } from '@/utils/auth'
import { refreshToken } from '@/api/login'
import Config from '@/settings'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // api 的 base_url
  timeout: Config.timeout // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    const token = getToken()
    const tokenType = getTokenType()
    const tokenExpire = getTokenExpire()
    if (token != null && tokenType != null && tokenExpire != null) {
      const curTime = new Date()
      const expireTime = new Date(Date.parse(tokenExpire))

      if (curTime < expireTime) {
        // 如果token未过期 让每个请求携带自定义token
        config.headers['Authorization'] = tokenType + ' ' + token
      }
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    let errorMsg = '请求错误'
    let code = 0
    // 兼容blob下载出错json提示
    if (error.response.data instanceof Blob && error.response.data.type.toLowerCase().indexOf('json') !== -1) {
      const reader = new FileReader()
      reader.readAsText(error.response.data, 'utf-8')
      reader.onload = function(e) {
        errorMsg = JSON.parse(reader.result).message
        Message.error({
          message: errorMsg,
          duration: 5000,
          center: true,
          showClose: true
        })
      }
    } else {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        errorMsg = '网络请求超时！'
      } else if (error.response) {
        code = error.response.status
        if (code === 400) {
          errorMsg = error.response.data.message
        } else if (code === 401) {
          const refreshTokenExpires = getRefreshTokenExpires()
          const token = getToken()
          const curTime = new Date()
          const refreshTokenExpiresTime = new Date(Date.parse(refreshTokenExpires))
          if (token !== null && refreshTokenExpires !== null && curTime < refreshTokenExpiresTime) {
            refreshToken(token).then(res => {
              if (res && res.hasOwnProperty('access_token')) {
                setToken(res)
                error.config.__isRetryRequest = true
                error.config.headers['Authorization'] = getTokenType() + ' ' + res.access_token
                return axios(error.config)
              } else {
                Message.warning({
                  message: res.message,
                  duration: 5000,
                  center: true,
                  showClose: true
                })
                window.localStorage.clear()
                store.dispatch('LogOut').then(() => {
                  location.reload()
                })
              }
            })
          } else {
            window.localStorage.clear()
            store.dispatch('LogOut').then(() => {
              location.reload()
            })
          }
        } else if (code === 403) {
          errorMsg = error.response.data.message
        } else if (code === 404) {
          errorMsg = '请求失败，接口不存在！'
        } else if (code === 429) {
          errorMsg = error.response.data.message
        } else if (code === 500) {
          errorMsg = error.response.data.message !== undefined ? error.response.data.message : error.response.statusText
        } else {
          errorMsg = error.response.data.message !== undefined ? error.response.data.message : error.response.statusText
        }
      } else {
        errorMsg = '请求失败，请检查服务状态！'
      }
      if (code !== 401) {
        Message.error({
          message: errorMsg,
          duration: 5000,
          center: true,
          showClose: true
        })
      }
    }
    return Promise.reject(error)
  }
)

export default service
