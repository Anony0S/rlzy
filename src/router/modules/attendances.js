// 导出考勤的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/attendances', // 路由地址
  component: Layout,
  meta: { id: 'attendances' },
  children: [
    {
      // 二级路由的 path 什么都不用写，此时表示二级路由的默认路由
      path: '',
      name: 'attendances', // 给模块的一级路由加一个 name 属性，做权限的时候用
      component: () => import('@/views/attendances'),
      // 路由元信息
      meta: {
        // 放置title 供左侧导航读取
        title: '考勤',
        icon: 'skill'
      }
    }
  ]
}
