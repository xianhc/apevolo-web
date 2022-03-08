import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/storage/upload',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/storage/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/storage/edit',
    method: 'put',
    data
  })
}

export default { add, edit, del }
