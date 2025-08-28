import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/layouts/getlayoutslist',
    method: 'post',
    data: params
  })
}

// 新增
export const addDataApi = (params) => {
  return request({
    url: '/layouts/addlayouts',
    method: 'post',
    data: params
  })
}

// 编辑
export const editDataApi = (params) => {
  return request({
    url: '/layouts/uplayouts',
    method: 'post',
    data: params
  })
}

// 删除
export const delDataApi = (params) => {
  return request({
    url: '/layouts/dellayouts',
    method: 'post',
    data: params
  })
}

// 详情-列表
export const getDetailsListApi = (params) => {
  return request({
    url: '/layouts/getlayoutsinfolist',
    method: 'post',
    data: params
  })
}

// 详情-新增
export const addDetailsDataApi = (params) => {
  return request({
    url: '/layouts/addlayoutsinfo',
    method: 'post',
    data: params
  })
}

// 详情-编辑
export const editDetailsDataApi = (params) => {
  return request({
    url: '/layouts/uplayoutsinfo',
    method: 'post',
    data: params
  })
}

// 详情-编辑
export const delDetailsDataApi = (params) => {
  return request({
    url: '/layouts/dellayoutsinfo',
    method: 'post',
    data: params
  })
}

// 布局方案-列表
export const getLayoutPlanDataApi = (params) => {
  return request({
    url: '/layouts/getlayoutsplanlist',
    method: 'post',
    data: params
  })
}
// 布局方案-新增
export const addLayoutPlanDataApi = (params) => {
  return request({
    url: '/layouts/addlayoutsplan',
    method: 'post',
    data: params
  })
}
// 布局方案-编辑
export const editLayoutPlanDataApi = (params) => {
  return request({
    url: '/layouts/uplayoutsplan',
    method: 'post',
    data: params
  })
}
// 布局方案-删除
export const delLayoutPlanDataApi = (params) => {
  return request({
    url: '/layouts/dellayoutsplan',
    method: 'post',
    data: params
  })
}
