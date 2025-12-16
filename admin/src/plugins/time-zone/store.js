import { TIME_ZONES } from './time'

const STORAGE_KEY = '__GLOBAL_TIME_ZONE__'

export default function createTimeZoneModule(defaultZone) {
  return {
    namespaced: true,
    state: {
      timeZone: localStorage.getItem(STORAGE_KEY) || defaultZone
    },
    getters: {
      currentTimeZone: state => state.timeZone
    },
    mutations: {
      SET_TIME_ZONE(state, zone) {
        state.timeZone = zone
        localStorage.setItem(STORAGE_KEY, zone)
      }
    }
  }
}
