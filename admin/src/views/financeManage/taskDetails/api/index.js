import request from '@/utils/request'

// 任务明细 列表
export const getTaskRecordListApi = (params) => {
  return request({
    url: '/taskrecord/gettaskrecordlist',
    method: 'post',
    data: params
  })
}

// 拉群任务明细 列表
export const getTaskWsGroupRecordListApi = (params) => {
  return request({
    url: '/taskwsgrouprecord/gettaskwsgrouprecordlist',
    method: 'post',
    data: params
  })
}

// 分享群任务明细 列表
export const getTaskWsShareGroupRecordListApi = (params) => {
  return request({
    url: '/taskwssharegrouprecord/gettaskwssharegrouprecordlist',
    method: 'post',
    data: params
  })
}
// 分享群任务明细 列表
export const exportDataApi = (params) => {
  return request({
    url: '/taskwssharegrouprecord/exporttaskwssharegrouprecordlist',
    method: 'post',
    data: params
  })
}
