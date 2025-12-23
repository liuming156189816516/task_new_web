import request from '@/utils/request'

// 列表
export const getStatisticsList = (params) => {
  return request({
    url: '/statis/getstatislist',
    method: 'post',
    data: params
  })
}

// 列表
export const getTodayStatisticsInfo = (params) => {
  return request({
    url: '/statis/gettodaystatisinfo',
    method: 'post',
    data: params
  })
}
