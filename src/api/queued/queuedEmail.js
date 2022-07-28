import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/queued/email/create',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/queued/email/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/queued/email/edit',
    method: 'put',
    data
  })
}

export default { add, edit, del }
