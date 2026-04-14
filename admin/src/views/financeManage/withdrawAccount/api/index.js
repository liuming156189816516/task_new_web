import request from '@/utils/request'

// 列表
export const getDataApi = (params) => {
  return request({
    url: '/withdrawcard/getwithdrawcardlist',
    method: 'post',
    data: params
  })
}


// 编辑
export const editDataApi = (params) => {
  return request({
    url: '/withdrawcard/upwithdrawcard',
    method: 'post',
    data: params
  })
}

