import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/carousel/getcarousellist',
    method: 'post',
    data: params
  })
}

// 新增
export const addDataApi = (params) => {
  return request({
    url: '/carousel/addcarousel',
    method: 'post',
    data: params
  })
}

// 编辑
export const editDataApi = (params) => {
  return request({
    url: '/carousel/upcarousel',
    method: 'post',
    data: params
  })
}

// 删除
export const delDataApi = (params) => {
  return request({
    url: '/carousel/delcarousel',
    method: 'post',
    data: params
  })
}

// 拖拽排序
export const editSortDataApi = (params) => {
  return request({
    url: '/carousel/sortcarousel',
    method: 'post',
    data: params
  })
}
