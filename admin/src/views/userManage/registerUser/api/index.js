import request from '@/utils/request'

// 列表
export const getappuserlist = (params) => {
  return request({
    url: '/adminmember/getappuserlist',
    method: 'post',
    data: params
  })
}

// 操作
export const blacklist = (params) => {
  return request({
    url: '/adminmember/blacklist',
    method: 'post',
    data: params
  })
}
