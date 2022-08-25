// 员工管理
import request from '@/utils/request'

// 获取员工简单列表
export const getEmployeesSimple = () =>
  request({
    url: '/sys/user/simple'
  })

// 获取员工列表
export const getEmployeesList = (params) =>
  request({
    url: '/sys/user',
    params
  })

// 删除员工
export const delEmployee = (id) =>
  request({
    method: 'DELETE',
    url: `/sys/user/${id}`
  })

// 新增员工
export const addEmplayee = (data) =>
  request({
    method: 'POST',
    url: '/sys/user',
    data
  })

// 批量导入员工
export const importEmployees = (data) =>
  request({
    method: 'POST',
    url: '/sys/user/batch',
    data
  })
