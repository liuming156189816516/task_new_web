import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/theme/getthemelist',
    method: 'post',
    data: params
  })
}

// 新增
export const addDataApi = (params) => {
  return request({
    url: '/theme/addtheme',
    method: 'post',
    data: params
  })
}

// 编辑
export const editDataApi = (params) => {
  return request({
    url: '/theme/uptheme',
    method: 'post',
    data: params
  })
}

// 删除
export const delDataApi = (params) => {
  return request({
    url: '/theme/deltheme',
    method: 'post',
    data: params
  })
}
