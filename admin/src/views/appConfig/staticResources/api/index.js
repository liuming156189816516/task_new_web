import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/assets/getassetslist',
    method: 'post',
    data: params
  })
}

// 新增
export const addDataApi = (params) => {
  return request({
    url: '/assets/addassets',
    method: 'post',
    data: params
  })
}

// 编辑
export const editDataApi = (params) => {
  return request({
    url: '/assets/upassets',
    method: 'post',
    data: params
  })
}

// 删除
export const delDataApi = (params) => {
  return request({
    url: '/assets/delassets',
    method: 'post',
    data: params
  })
}

// 详情-列表
export const getDetailsListApi = (params) => {
  return request({
    url: '/assets/getassetsinfolist',
    method: 'post',
    data: params
  })
}

// 新增-列表
export const addDetailsDataApi = (params) => {
  return request({
    url: '/assets/addassetsinfo',
    method: 'post',
    data: params
  })
}

// 编辑-列表
export const editDetailsDataApi = (params) => {
  return request({
    url: '/assets/upassetsinfo',
    method: 'post',
    data: params
  })
}

// 编辑-列表
export const delDetailsDataApi = (params) => {
  return request({
    url: '/assets/delassetsinfo',
    method: 'post',
    data: params
  })
}
