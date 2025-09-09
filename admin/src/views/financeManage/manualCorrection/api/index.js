import request from '@/utils/request'

// 列表
export const getRecordReviseListApi = (params) => {
  return request({
    url: '/record/getrecordreviselist',
    method: 'post',
    data: params
  })
}

// 编辑 调整积分
export const editAmountApi = (params) => {
  return request({
    url: '/record/dorecordrevise',
    method: 'post',
    data: params
  })
}
