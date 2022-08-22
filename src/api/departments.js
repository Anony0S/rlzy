// 组织架构
import request from '@/utils/request'

// 获取组织架构部门列表
export const getDeaprtments = () =>
  request({
    url: '/company/department'
  })

// 删除组织架构部门
export const delDepartment = (id) =>
  request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })

// 新增部门
export const addDepartment = (data) =>
  request({
    method: 'POST',
    url: '/company/department',
    data
  })
