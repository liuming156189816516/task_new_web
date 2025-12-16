/**
 * 支持的时区常量
 */
export const TIME_ZONES = {
  BEIJING: 'Asia/Shanghai',
  BRAZIL: 'America/Sao_Paulo',
  MALAYSIA: 'Asia/Kuala_Lumpur'
}

/**
 * 时间戳 → 指定时区的日期时间
 */
export function formatByTimeZone(timestamp, timeZone, locale = 'zh-CN') {
  const date = normalizeTimestamp(timestamp)
  if (!date) return ''

  const formatter = new Intl.DateTimeFormat(locale, {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })

  const parts = formatter.formatToParts(date)
  const map = {}

  parts.forEach(p => {
    if (p.type !== 'literal') {
      map[p.type] = p.value
    }
  })

  return `${map.year}-${map.month}-${map.day} ${map.hour}:${map.minute}:${map.second}`
}

/**
 * 统一将时间戳转为「毫秒级」
 * @param {number|string|Date} input
 * @returns {Date|null}
 */
export function normalizeTimestamp(input) {
  if (!input && input !== 0) return null

  // Date 实例
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input
  }

  let ts = input

  // 字符串数字 → number
  if (typeof ts === 'string') {
    ts = ts.trim()
    if (!/^\d+$/.test(ts)) return null
    ts = Number(ts)
  }

  if (typeof ts !== 'number' || isNaN(ts)) return null

  // 秒级时间戳（10 位左右）
  if (ts < 1e12) {
    ts = ts * 1000
  }

  const date = new Date(ts)
  return isNaN(date.getTime()) ? null : date
}

