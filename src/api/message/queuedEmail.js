import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/email/queued/create',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/email/queued/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/email/queued/edit',
    method: 'put',
    data
  })
}

export default { add, edit, del }
