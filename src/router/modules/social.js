// 导出社保的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/social', // 路由地址
  component: Layout,
  meta: { id: 'social_security' },
  children: [
    {
      // 二级路由的 path 什么都不用写，此时表示二级路由的默认路由
      path: '',
      name: 'social', // 给模块的一级路由加一个 name 属性，做权限的时候用
      component: () => import('@/views/social'),
      // 路由元信息
      meta: {
        // 放置title 供左侧导航读取
        title: '社保',
        icon: 'table'
      }
    }
  ]
}
