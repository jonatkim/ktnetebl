// utils/date.js
import dayjs from 'dayjs'
import 'dayjs/locale/ko'

dayjs.locale('ko')

/**
 * 날짜를 지정한 형식의 문자열로 변환한다.
 * @param {string|number|Date|dayjs.Dayjs|null|undefined} value 변환 대상 값
 * @param {string} [format='YYYY-MM-DD'] 출력 형식
 * @returns {string} 포맷팅된 날짜 문자열
 */
export function formatDate(value, format = 'YYYY-MM-DD') {
  if (!value) return ''
  return dayjs(value).format(format)
}

/**
 * 현재 시간을 ISO 8601 형식의 문자열로 반환한다.
 * @returns {string} ISO 8601 형식의 문자열
 */
export function nowIso() {
  return dayjs().toISOString()
}