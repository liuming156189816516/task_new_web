import request from '@/utils/request'

// 数据统计列表
export const getStatisticsList = (params) => {
  return request({
    url: '/statis/getstatislist',
    method: 'post',
    data: params
  })
}

// 当日统计数据
export const getTodayStatisticsInfo = (params) => {
  return request({
    url: '/statis/gettodaystatisinfo',
    method: 'post',
    data: params
  })
}
