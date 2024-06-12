import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/tenant/create',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/tenant/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/tenant/edit',
    method: 'put',
    data
  })
}

export function getAllTenant() {
  return request({
    url: 'api/tenant/queryAll',
    method: 'get'
  })
}

export default { add, edit, del }
