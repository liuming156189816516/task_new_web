import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/meta/getmetalist',
    method: 'post',
    data: params
  })
}

// 新增
export const addDataApi = (params) => {
  return request({
    url: '/meta/addmeta',
    method: 'post',
    data: params
  })
}

// 编辑
export const editDataApi = (params) => {
  return request({
    url: '/meta/upmeta',
    method: 'post',
    data: params
  })
}

// 删除
export const delDataApi = (params) => {
  return request({
    url: '/meta/delmeta',
    method: 'post',
    data: params
  })
}

// 更新类型
export const upAppDataApi = (params) => {
  return request({
    url: '/meta/upapp',
    method: 'post',
    data: params
  })
}
1
