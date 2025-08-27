import request from '@/utils/request'

// 列表 App主题
export const getAppThemeDataApi = (params) => {
  return request({
    url: '/theme/getthemelist',
    method: 'post',
    data: params
  })
}

// 列表 国际化
export const getInternationalizeDataApi = (params) => {
  return request({
    url: '/il8n/getil8nlist',
    method: 'post',
    data: params
  })
}

// 列表 静态资源
export const getStaticResourcesDataApi = (params) => {
  return request({
    url: '/assets/getassetslist',
    method: 'post',
    data: params
  })
}

// 列表 布局配置
// export const getStaticResourcesDataApi = (params) => {
//   return request({
//     url: '/assets/getassetslist',
//     method: 'post',
//     data: params
//   })
// }
