import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/bug/getbuglist',
    method: 'post',
    data: params
  })
}

// 新增
export const addDataApi = (params) => {
  return request({
    url: '/bug/addbug',
    method: 'post',
    data: params
  })
}

// 编辑
export const editDataApi = (params) => {
  return request({
    url: '/bug/upbug',
    method: 'post',
    data: params
  })
}

// 删除
export const delDataApi = (params) => {
  return request({
    url: '/bug/delbug',
    method: 'post',
    data: params
  })
}
