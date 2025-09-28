import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/publierapp/getpublierapplist',
    method: 'post',
    data: params
  })
}

// 新增
export const addDataApi = (params) => {
  return request({
    url: '/publierapp/addpublierapp',
    method: 'post',
    data: params
  })
}

// 编辑
export const editDataApi = (params) => {
  return request({
    url: '/publierapp/uppublierapp',
    method: 'post',
    data: params
  })
}

// 删除
export const delDataApi = (params) => {
  return request({
    url: '/publierapp/delpublierapp',
    method: 'post',
    data: params
  })
}

// 排序
export const editSortDataApi = (params) => {
  return request({
    url: '/publierapp/sortpublierapp',
    method: 'post',
    data: params
  })
}

// 修改发布状态
export const editReleaseStatusApi = (params) => {
  return request({
    url: '/publierapp/uppublierappreleasestatus',
    method: 'post',
    data: params
  })
}

// 详情-套餐-列表
export const getDetailsListApi = (params) => {
  return request({
    url: '/appcombo/getappcombolist',
    method: 'post',
    data: params
  })
}

// 详情-套餐-新增
export const addDetailsDataApi = (params) => {
  return request({
    url: '/appcombo/addappcombo',
    method: 'post',
    data: params
  })
}

// 详情-套餐-编辑
export const editDetailsDataApi = (params) => {
  return request({
    url: '/appcombo/upappcombo',
    method: 'post',
    data: params
  })
}

// 详情-套餐-编辑
export const delDetailsDataApi = (params) => {
  return request({
    url: '/appcombo/delappcombo',
    method: 'post',
    data: params
  })
}
