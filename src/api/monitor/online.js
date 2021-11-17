import request from '@/utils/request'

export function del(keys) {
  let data
  // eslint-disable-next-line prefer-const
  data = keys.constructor === Array ? keys : Array.of(keys)
  return request({
    url: 'api/online/out',
    method: 'delete',
    data: data
  })
}
