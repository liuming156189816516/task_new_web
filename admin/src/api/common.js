// 上传文件
import request from '@/utils/request';

// 上传整个文件
export const uploadFileApi = (params) => {
  return request({
    url: '/material/upload',
    method: 'post',
    data: params
  })
}
// 分片上传
export const uploadSliceFileApi = (params) => {
  return request({
    url: '/material/uploadchunk',
    method: 'post',
    data: params,
  })
}

// 合并分片
export const mergeFragmentFileApi = (params) => {
  return request({
    url: '/material/mergechunks',
    method: 'post',
    data: params,
  })
}

// 上传文件
export const uploadImgFileApi = (params) => {
  return request({
    url: '/material/uploadassets',
    method: 'post',
    data: params,
  })
}

// 获取国际化 语言包 list
export const getLanguagePageListApi = (params) => {
  return request({
    url: '/language/getlanguagecontent',
    method: 'post',
    data: params
  })
}
