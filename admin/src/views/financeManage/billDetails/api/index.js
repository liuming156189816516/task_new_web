import request from '@/utils/request'

// 列表
export const getBillRecordListApi = (params) => {
  return request({
    url: '/record/getbillrecordlist',
    method: 'post',
    data: params
  })
}
