import request from '@/utils/request'

export function getDepts(params) {
  return request({
    url: 'api/dept/query',
    method: 'get',
    params
  })
}

export function getDeptSuperior(id) {
  const idCollection = { idArray: [id] }
  return request({
    url: 'api/dept/superior',
    method: 'post',
    data: idCollection
  })
}

export function add(data) {
  return request({
    url: 'api/dept/create',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/dept/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/dept/edit',
    method: 'put',
    data
  })
}

export default { add, edit, del, getDepts, getDeptSuperior }
