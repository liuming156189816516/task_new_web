import createTimeZoneModule from './store'
import { formatByTimeZone, TIME_ZONES } from './time'

const MODULE_NAME = 'timeZone'

export default {

  install(Vue, options = {}) {
    if (!options.store) {
      throw new Error('[TimeZonePlugin] store is required')
    }

    const {
      store,
      defaultTimeZone = TIME_ZONES.BRAZIL
    } = options

    // =========================
    // ✅ 关键修复点（兼容所有 Vuex）
    // =========================
    if (!store._modulesNamespaceMap[`${MODULE_NAME}/`]) {
      store.registerModule(
        MODULE_NAME,
        createTimeZoneModule(defaultTimeZone)
      )
    }

    // 全局时间格式化
    Vue.prototype.$time = function(timestamp) {
      const zone = store.getters[`${MODULE_NAME}/currentTimeZone`]
      return formatByTimeZone(timestamp, zone)
    }

    // 切换全局时区
    Vue.prototype.$setTimeZone = function(zone) {
      store.commit(`${MODULE_NAME}/SET_TIME_ZONE`, zone)
    }

    Vue.prototype.$TIME_ZONES = TIME_ZONES
  }
}
