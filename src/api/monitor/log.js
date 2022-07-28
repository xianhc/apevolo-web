import request from '@/utils/request'

export function getErrDetail(id) {
  return request({
    url: 'api/exception/detail/' + id,
    method: 'get'
  })
}

export function delAllError() {
  return request({
    url: 'api/exception/del/error',
    method: 'delete'
  })
}

export function delAllInfo() {
  return request({
    url: 'api/exception/del/info',
    method: 'delete'
  })
}
