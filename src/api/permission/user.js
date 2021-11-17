import request from '@/utils/request'
import { encrypt } from '@/utils/rsaEncrypt'

export function add(data) {
  return request({
    url: 'api/user/create',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/user/delete',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/user/edit',
    method: 'put',
    data
  })
}

export function editUser(data) {
  return request({
    url: 'api/user/center',
    method: 'put',
    data
  })
}

export function updatePass(user) {
  const data = {
    oldPassword: encrypt(user.oldPass),
    newPassword: encrypt(user.newPass)
  }
  return request({
    url: 'api/user/update/password',
    method: 'post',
    data
  })
}

export function updateEmail(form) {
  const data = {
    password: encrypt(form.pass),
    email: form.email,
    code: form.code
  }
  return request({
    url: 'api/user/update/Email',
    method: 'post',
    data
  })
}

export default { add, edit, del }

