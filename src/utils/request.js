import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getRefreshTokenExpires, getToken, getTokenExpire, getTokenType } from '@/utils/auth'
import Config from '@/settings'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '/', // api 的 base_url
  timeout: Config.timeout // 请求超时时间
})

let isRefreshing = false // 表示是否正在刷新token
let failedQueue = [] // 存储失败的请求

// 刷新token
function refreshToken() {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    }).then(token => {
      return token
    })
  }

  isRefreshing = true
  return service.post('/auth/refreshToken', { token: getToken() })
    .then((res) => {
      window.localStorage.setItem('x-token', res.refresh_token)
      window.localStorage.setItem('expires_in', res.expires_in)
      const curTime = new Date()
      window.localStorage.token_expire = new Date(curTime.setSeconds(curTime.getSeconds() + res.expires_in))
      return res.refresh_token
    }).catch(() => {
      window.localStorage.clear()
      store.dispatch('LogOut').then(() => {
        location.reload()
      })
    }).finally(() => {
      isRefreshing = false
      // 成功刷新token后，重新发起所有失败的请求
      const queue = [...failedQueue]
      failedQueue = []
      queue.forEach((request) => {
        request.resolve(window.localStorage.getItem('x-token'))
      })
    })
}

// 当刷新token成功后，清空失败队列并重新发起请求
// function retryFailedRequests(token) {
//   failedQueue.forEach((request) => {
//     request.resolve(token)
//   })
//   failedQueue = []
// }

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
        } else if (code === 401 && !error.config._retry) {
          const refreshTokenExpires = getRefreshTokenExpires()
          const token = getToken()
          const curTime = new Date()
          const refreshTokenExpiresTime = new Date(Date.parse(refreshTokenExpires))
          if (token !== null && refreshTokenExpires !== null && curTime < refreshTokenExpiresTime) {
            if (!isRefreshing) {
              return refreshToken().then((newToken) => {
                error.config.headers.Authorization = getTokenType() + ` ${newToken}`
                return service(error.config)
              })
            } else {
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject })
              }).then(newToken => {
                error.config.headers.Authorization = getTokenType() + ` ${newToken}`
                return service(error.config)
              })
            }
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
