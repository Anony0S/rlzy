import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
const tokenTimeOut = 3600

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 请求超时
})

// 请求拦截器 ===> 接收两个回调函数
service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      if (isTimeOut()) {
        store.dispatch('user/logout')
        router.push('/login')
        return Promise.reject(new Error('Token超时了！'))
      }
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { success, message, data } = response.data
    if (success) {
      return data
    } else {
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  },
  (error) => {
    // 被动处理 Token 超时
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 10002
    ) {
      store.dispatch('user/logout')
      router.push('/login')
    } else {
      Message.error('登录失败！')
    }
    return Promise.reject(error)
  }
)

// 定义是否超时函数
function isTimeOut() {
  return (Date.now() - getTimeStamp()) / 1000 > tokenTimeOut
}

export default service
