import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/api/tasks/create',
    method: 'post',
    data
  })
}

export function del(ids) {
  const data = ids.constructor === Array ? ids : Array.of(ids)
  return request({
    url: '/api/tasks/delete',
    method: 'delete',
    data: data
  })
}

export function edit(data) {
  return request({
    url: 'api/tasks/edit',
    method: 'put',
    data
  })
}

export function updateIsPause(id) {
  return request({
    url: 'api/tasks/' + id,
    method: 'put'
  })
}

export function execution(id) {
  return request({
    url: 'api/tasks/execute/' + id,
    method: 'put'
  })
}

export function pause(id) {
  return request({
    url: 'api/tasks/pause/' + id,
    method: 'put'
  })
}

export function resume(id) {
  return request({
    url: 'api/tasks/resume/' + id,
    method: 'put'
  })
}

export default { del, updateIsPause, execution, add, edit, pause, resume }
