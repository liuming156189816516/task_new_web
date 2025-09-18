import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/reactpackage/getreactpackagelist',
    method: 'post',
    data: params
  })
}

// 新增
export const addDataApi = (params) => {
  return request({
    url: '/reactpackage/addreactpackage',
    method: 'post',
    data: params
  })
}

// 编辑
export const editDataApi = (params) => {
  return request({
    url: '/reactpackage/upreactpackage',
    method: 'post',
    data: params
  })
}

// 删除
export const delDataApi = (params) => {
  return request({
    url: '/reactpackage/delreactpackage',
    method: 'post',
    data: params
  })
}
