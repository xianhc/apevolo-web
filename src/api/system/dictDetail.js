import request from '@/utils/request'

export function get(dictName) {
  const params = {
    dictName
  }
  return request({
    url: 'api/dictDetail/query',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/dictDetail/create',
    method: 'post',
    data
  })
}

export function del(ids) {
  const firstId = ids.idArray[0]
  return request({
    url: 'api/dictDetail/delete?id=' + firstId,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/dictDetail/edit',
    method: 'put',
    data
  })
}

export default { add, edit, del }
