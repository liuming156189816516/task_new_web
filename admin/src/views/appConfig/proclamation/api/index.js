import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/announcement/getannouncementlist',
    method: 'post',
    data: params
  })
}

// 新增
export const addDataApi = (params) => {
  return request({
    url: '/announcement/addannouncement',
    method: 'post',
    data: params
  })
}

// 编辑
export const editDataApi = (params) => {
  return request({
    url: '/announcement/upannouncement',
    method: 'post',
    data: params
  })
}

// 删除
export const delDataApi = (params) => {
  return request({
    url: '/announcement/delannouncement',
    method: 'post',
    data: params
  })
}
