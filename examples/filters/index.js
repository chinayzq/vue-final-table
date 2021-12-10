import moment from 'moment';

/**
 * 日期格式化过滤器
 * @param dateStr 所有可以被moment初始化的日期
 * @param pattern 转换格式
 * @returns {string}
 */
export function dateFormat(dateStr, pattern = 'YYYY-MM-DD') {
  if (dateStr === undefined || dateStr === null || dateStr === '') {
    return '-';
  }
  return moment(dateStr).format(pattern);
}

/**
 * 日期格式化过滤器
 * @param dateStr 所有可以被moment初始化的日期
 * @param pattern 转换格式
 * @returns {string}
 * 备注: 告警列表(告警时间)，设备-设备影子历史（上报时间），设备-时间（上报时间），设备-服务（下发时间，响应时间），设备-设备日志（上报时间）
 * 以上时间需要 -8H
 */
export function dateFormatSpaciel(dateStr, pattern = 'YYYY-MM-DD') {
  if (dateStr === undefined || dateStr === null || dateStr === '') {
    return '-';
  }
  dateStr = new Date(dateStr).getTime();
  dateStr -= 8 * 60 * 60 * 1000; // 减去8H
  return moment(dateStr).format(pattern);
}
