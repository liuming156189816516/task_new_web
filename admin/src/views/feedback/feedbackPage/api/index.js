import request from '@/utils/request'

// 列表
export const getFeedbackListApi = (params) => {
  return request({
    url: '/feedback/getfeedbacklist',
    method: 'post',
    data: params
  })
}

// 列表
export const delFeedbackListApi = (params) => {
  return request({
    url: '/feedback/delfeedback',
    method: 'post',
    data: params
  })
}
