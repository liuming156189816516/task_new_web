import request from '@/utils/request'

// 列表
export const gettaskrecordlistApi = (params) => {
  return request({
    url: '/taskrecord/gettaskrecordlist',
    method: 'post',
    data: params
  })
}
