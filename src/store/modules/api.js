// 适配 Nginx 反向代理
const baseUrl = process.env.VUE_APP_BASE_API === '/' ? '' : process.env.VUE_APP_BASE_API
const api = {
  state: {
    // 修改头像
    updateAvatarApi: baseUrl + '/api/user/update/avatar',
    // 文件上传
    fileUploadApi: baseUrl + '/api/storage',
    // baseUrl，
    baseApi: baseUrl
  }
}

export default api
