import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/setting/create',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/setting/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/setting/edit',
    method: 'put',
    data
  })
}

export default { add, edit, del }
