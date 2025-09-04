import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/activity/getactivitylist',
    method: 'post',
    data: params
  })
}

// 新增
export const addDataApi = (params) => {
  return request({
    url: '/activity/addactivity',
    method: 'post',
    data: params
  })
}

// 编辑
export const editDataApi = (params) => {
  return request({
    url: '/activity/upactivity',
    method: 'post',
    data: params
  })
}

// 删除
export const delDataApi = (params) => {
  return request({
    url: '/activity/delactivity',
    method: 'post',
    data: params
  })
}

// 拖拽排序
export const editSortDataApi = (params) => {
  return request({
    url: '/activity/sortactivity',
    method: 'post',
    data: params
  })
}
