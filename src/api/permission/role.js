import request from '@/utils/request'

export function getAllRole() {
  return request({
    url: 'api/role/queryAll',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'api/role/create',
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: 'api/role/querySingle?id=' + id,
    method: 'get'
  })
}

export function getLevel() {
  return request({
    url: 'api/role/level',
    method: 'get'
  })
}

export function del(ids) {
  return request({
    url: 'api/role/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/role/edit',
    method: 'put',
    data
  })
}

export function getMenusTree() {
  return request({
    url: 'api/permissions/menus/query',
    method: 'get'
  })
}

export function getApisTree() {
  return request({
    url: 'api/permissions/apis/query',
    method: 'get'
  })
}

export function editMenu(data) {
  return request({
    url: 'api/permissions/menus/edit',
    method: 'put',
    data
  })
}

export function editApi(data) {
  return request({
    url: 'api/permissions/apis/edit',
    method: 'put',
    data
  })
}

export default { add, edit, del, get, editMenu, editApi, getLevel, getMenusTree, getApisTree }
