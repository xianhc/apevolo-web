import request from '@/utils/request'

export function del(keys) {
  debugger
  const idCollection = { idArray: [] }
  if (keys instanceof Array) {
    keys.forEach(val => {
      idCollection.idArray.push(val)
    })
  } else {
    idCollection.idArray.push(keys)
  }
  return request({
    url: 'api/online/out',
    method: 'delete',
    data: idCollection
  })
}
