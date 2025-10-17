import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/language/getlanguagelist',
    method: 'post',
    data: params
  })
}

// 新增
export const addDataApi = (params) => {
  return request({
    url: '/language/addlanguage',
    method: 'post',
    data: params
  })
}

// 编辑
export const editDataApi = (params) => {
  return request({
    url: '/language/uplanguage',
    method: 'post',
    data: params
  })
}

// 删除
export const delDataApi = (params) => {
  return request({
    url: '/language/dellanguage',
    method: 'post',
    data: params
  })
}
