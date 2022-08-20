import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token'
const TimeStampKey = 'hrsaas-ihrm-timestapm'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 读取时间戳
export const getTimeStamp = () => {
  return Cookies.get(TimeStampKey)
}

// 设置时间戳
export const setTimeStamp = () => {
  Cookies.set(TimeStampKey, Date.now())
}
