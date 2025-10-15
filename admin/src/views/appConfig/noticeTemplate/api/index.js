import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/notifytemplate/getnotifytemplatelist',
    method: 'post',
    data: params
  })
}

// 新增
export const addDataApi = (params) => {
  return request({
    url: '/notifytemplate/addnotifytemplate',
    method: 'post',
    data: params
  })
}

// 编辑
export const editDataApi = (params) => {
  return request({
    url: '/notifytemplate/upnotifytemplate',
    method: 'post',
    data: params
  })
}

// 删除
export const delDataApi = (params) => {
  return request({
    url: '/notifytemplate/delnotifytemplate',
    method: 'post',
    data: params
  })
}
