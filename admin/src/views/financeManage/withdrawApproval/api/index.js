import request from '@/utils/request'

// 列表
export const getwithdrawapprovallist = (params) => {
  return request({
    url: '/withdraw/getwithdrawapprovallist',
    method: 'post',
    data: params
  })
}
//
export const doapproval = (params) => {
  return request({
    url: '/withdraw/doapproval',
    method: 'post',
    data: params
  })
}

// 提现配置 列表
export const getDataApi = (params) => {
  return request({
    url: '/withdraw/getwithdrawconfiglist',
    method: 'post',
    data: params
  })
}

// 提现配置 新增
export const addDataApi = (params) => {
  return request({
    url: '/withdraw/addwithdrawconfig',
    method: 'post',
    data: params
  })
}

// 提现配置 编辑
export const editDataApi = (params) => {
  return request({
    url: '/withdraw/upwithdrawconfig',
    method: 'post',
    data: params
  })
}

// 提现配置 删除
export const delDataApi = (params) => {
  return request({
    url: '/withdraw/delwithdrawconfig',
    method: 'post',
    data: params
  })
}
