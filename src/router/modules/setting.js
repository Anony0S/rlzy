// 导出公司设置的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/setting', // 路由地址
  component: Layout,
  meta: { id: 'settings' },
  children: [
    {
      // 二级路由的 path 什么都不用写，此时表示二级路由的默认路由
      path: '',
      name: 'setting', // 给模块的一级路由加一个 name 属性，做权限的时候用
      component: () => import('@/views/setting'),
      // 路由元信息
      meta: {
        // 放置title 供左侧导航读取
        title: '公司设置',
        icon: 'setting'
      }
    }
  ]
}
