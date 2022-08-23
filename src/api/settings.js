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
