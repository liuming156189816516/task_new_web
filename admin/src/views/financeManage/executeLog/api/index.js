import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/executelog/getexecuteloglist',
    method: 'post',
    data: params
  })
}

// 删除
export const delDataApi = (params) => {
  return request({
    url: '/executelog/delexecutelog',
    method: 'post',
    data: params
  })
}
