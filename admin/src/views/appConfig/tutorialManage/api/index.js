import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/tutorial/gettutoriallist',
    method: 'post',
    data: params
  })
}

// 新增
export const addDataApi = (params) => {
  return request({
    url: '/tutorial/addtutorial',
    method: 'post',
    data: params
  })
}

// 编辑
export const editDataApi = (params) => {
  return request({
    url: '/tutorial/uptutorial',
    method: 'post',
    data: params
  })
}

// 删除
export const delDataApi = (params) => {
  return request({
    url: '/tutorial/deltutorial',
    method: 'post',
    data: params
  })
}
