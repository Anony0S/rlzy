import request from '@/utils/request'

// 获取所有角色列表
export const getRoles = (params) =>
  request({
    url: '/sys/role',
    params
  })

// 根据 ID 查询企业信息
export const getCompanyInfo = (companyID) =>
  request({
    url: `/company/${companyID}`
  })

// 删除角色
export const delRole = (id) =>
  request({
    method: 'DELETE',
    url: `/sys/role/${id}`
  })

// 根据 ID 获取角色详情
export const getRoleDetalis = (id) =>
  request({
    method: 'GET',
    url: `/sys/role/${id}`
  })

// 更新角色
export const updateRole = (data) =>
  request({
    url: `/sys/role/${data.id}`,
    method: 'PUT',
    data
  })

// 新增角色
export const addRole = (data) =>
  request({
    method: 'POST',
    url: '/sys/role',
    data
  })

// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
