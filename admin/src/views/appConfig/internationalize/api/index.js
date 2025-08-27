import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/il8n/getil8nlist',
    method: 'post',
    data: params
  })
}

// 新增
export const addDataApi = (params) => {
  return request({
    url: '/il8n/addil8n',
    method: 'post',
    data: params
  })
}

// 编辑
export const editDataApi = (params) => {
  return request({
    url: '/il8n/upil8n',
    method: 'post',
    data: params
  })
}

// 删除
export const delDataApi = (params) => {
  return request({
    url: '/il8n/delil8n',
    method: 'post',
    data: params
  })
}

// 详情-列表
export const getDetailsListApi = (params) => {
  return request({
    url: '/il8n/getil8ninfolist',
    method: 'post',
    data: params
  })
}

// 详情-新增
export const addDetailsDataApi = (params) => {
  return request({
    url: '/il8n/addil8ninfo',
    method: 'post',
    data: params
  })
}

// 详情-编辑
export const editDetailsDataApi = (params) => {
  return request({
    url: '/il8n/upil8ninfo',
    method: 'post',
    data: params
  })
}

// 详情-编辑
export const delDetailsDataApi = (params) => {
  return request({
    url: '/il8n/delil8ninfo',
    method: 'post',
    data: params
  })
}
