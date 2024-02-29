import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/apis/create',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/apis/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/apis/edit',
    method: 'put',
    data
  })
}

export function refresh(data) {
  return request({
    url: 'api/apis/refresh',
    method: 'POST',
    data
  })
}

export default { add, edit, del, refresh }
