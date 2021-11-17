import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/email/template/create',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/email/template/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/email/template/edit',
    method: 'put',
    data
  })
}

export default { add, edit, del }
