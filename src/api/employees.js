// 员工管理
import request from '@/utils/request'

export const getEmployeesSimple = () =>
  request({
    url: '/sys/user/simple'
  })
