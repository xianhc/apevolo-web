import request from '@/utils/request'

export function getMenusTree(pid) {
  return request({
    url: 'api/menu/lazy?pid=' + pid,
    method: 'get'
  })
}

export function getMenus(params) {
  return request({
    url: 'api/menu/query',
    method: 'get',
    params
  })
}

export function getMenuSuperior(id) {
  const idCollection = { idArray: [id] }
  return request({
    url: 'api/menu/superior',
    method: 'post',
    data: idCollection
  })
}

export function getChild(id) {
  return request({
    url: 'api/menu/child?id=' + id,
    method: 'get'
  })
}

export function buildMenus() {
  return request({
    url: 'api/menu/build',
    method: 'get'
  })
}

export function add(data) {
  data.type = Number(data.type)
  return request({
    url: 'api/menu/create',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/menu/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/menu/edit',
    method: 'put',
    data
  })
}

export default { add, edit, del, getMenusTree, getMenuSuperior, getMenus, getChild }
