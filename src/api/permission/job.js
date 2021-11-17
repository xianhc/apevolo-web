import request from '@/utils/request'

export function getAllJob() {
  return request({
    url: 'api/job/queryAll',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/job/create',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/job/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/job/edit',
    method: 'put',
    data
  })
}

export default { add, edit, del }
