import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/badge/getbadgelist',
    method: 'post',
    data: params
  })
}

// 新增
export const addDataApi = (params) => {
  return request({
    url: '/badge/addbadge',
    method: 'post',
    data: params
  })
}

// 编辑
export const editDataApi = (params) => {
  return request({
    url: '/badge/upbadge',
    method: 'post',
    data: params
  })
}

// 删除
export const delDataApi = (params) => {
  return request({
    url: '/badge/delbadge',
    method: 'post',
    data: params
  })
}
