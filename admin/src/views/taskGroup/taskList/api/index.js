import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/task/gettasklist',
    method: 'post',
    data: params
  })
}

// 新增
export const addDataApi = (params) => {
  return request({
    url: '/task/addtask',
    method: 'post',
    data: params
  })
}

// 编辑
export const editDataApi = (params) => {
  return request({
    url: '/task/uptask',
    method: 'post',
    data: params
  })
}

// 删除
export const delDataApi = (params) => {
  return request({
    url: '/task/deltask',
    method: 'post',
    data: params
  })
}

// 拖拽排序
export const editSortDataApi = (params) => {
  return request({
    url: '/task/sorttask',
    method: 'post',
    data: params
  })
}
