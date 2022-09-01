import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

export function logout() {}

// 获取用户信息
export const getUserInfo = () =>
  request({
    url: '/sys/profile',
    method: 'POST'
  })

// 通过ID获取用户详细信息
export const getDetaliInfoById = (id) =>
  request({
    method: 'GET',
    url: `/sys/user/${id}`
  })
