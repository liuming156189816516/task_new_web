import axios from 'axios'
import i18n from '@/locale'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/auth'

/**
 * ========================
 * 基础配置
 * ========================
 */
const baseURL =
  process.env.NODE_ENV === 'production'
    ? `${process.env.VUE_APP_BASE_PATH}:${process.env.VUE_APP_SERVER_PORT}`
    : '/api'

/**
 * 防止多次 401 重复跳转
 */
let isRelogin = false

/**
 * 创建 axios 实例
 */
const service = axios.create({
  baseURL,
  timeout: 15000
})

/**
 * ========================
 * 请求拦截器
 * ========================
 */
service.interceptors.request.use(
  config => {
    const token = getToken()

    // 默认 Content-Type（允许被单个请求覆盖）
    config.headers['Content-Type'] =
      config.headers['Content-Type'] || 'application/json;charset=utf-8'

    // 携带 token
    if (token) {
      config.headers['x-token'] = token
    }

    /**
     * 兼容：GET 请求误用 data 的情况
     */
    if (config.method === 'get' && config.data) {
      config.params = {
        ...config.params,
        ...config.data
      }
      delete config.data
    }

    return config
  },
  error => Promise.reject(error)
)

/**
 * ========================
 * 响应拦截器
 * ========================
 */
service.interceptors.response.use(
  response => {
    const res = response.data

    /**
     * 成功
     */
    if (res.code === 0) {
      return res
    }

    /**
     * token 失效相关错误码（业务码）
     */
    const reloginCodes = [401, 50012, 50014]

    if (reloginCodes.includes(res.code)) {
      handleRelogin()
      return Promise.reject(res)
    }

    /**
     * 其它业务错误
     */
    Message({
      message: res.msg || i18n.t('sys_error') || 'Error',
      type: 'error',
      duration: 5000
    })

    return Promise.reject(res)
  },

  error => {
    /**
     * HTTP 状态码错误（如 401）
     */
    const status = error.response?.status

    if (status === 401) {
      handleRelogin()
      return Promise.reject(error)
    }

    /**
     * 网络 / 服务异常
     */
    Message({
      message:
        error.response?.data?.msg ||
        error.message ||
        i18n.t('sys_error') ||
        'Network Error',
      type: 'error',
      duration: 5000
    })

    return Promise.reject(error)
  }
)

/**
 * ========================
 * 统一重新登录处理
 * ========================
 */
function handleRelogin() {
  if (isRelogin) return

  isRelogin = true

  MessageBox.confirm(
    i18n.t('sys_l010') || '登录状态已失效，请重新登录',
    i18n.t('sys_l013') || '提示',
    {
      confirmButtonText: i18n.t('sys_c024') || '重新登录',
      showCancelButton: false,
      closeOnClickModal: false,
      showClose: false,
      type: 'warning'
    }
  ).then(() => {
    store.dispatch('user/resetToken').then(() => {
      isRelogin = false

      router.replace({
        path: '/login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
    })
  })
}

export default service
