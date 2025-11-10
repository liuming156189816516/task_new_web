import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/taskcategories/gettaskcategorieslist',
    method: 'post',
    data: params
  })
}

// 新增
export const addDataApi = (params) => {
  return request({
    url: '/taskcategories/addtaskcategories',
    method: 'post',
    data: params
  })
}

// 编辑
export const editDataApi = (params) => {
  return request({
    url: '/taskcategories/uptaskcategories',
    method: 'post',
    data: params
  })
}

// 删除
export const delDataApi = (params) => {
  return request({
    url: '/taskcategories/deltaskcategories',
    method: 'post',
    data: params
  })
}

// 拖拽排序
export const editSortDataApi = (params) => {
  return request({
    url: '/taskcategories/sorttaskcategories',
    method: 'post',
    data: params
  })
}

// 修改发布状态
export const editReleaseStatusApi = (params) => {
  return request({
    url: '/taskcategories/uptaskcategoriesreleasestatus',
    method: 'post',
    data: params
  })
}
