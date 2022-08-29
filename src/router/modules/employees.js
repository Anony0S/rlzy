// 导出员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/employees', // 路由地址
  name: 'employees', // 给模块的一级路由加一个 name 属性，做权限的时候用
  component: Layout,
  children: [
    {
      // 二级路由的 path 什么都不用写，此时表示二级路由的默认路由
      path: '',
      component: () => import('@/views/employees'),
      // 路由元信息
      meta: {
        // 放置title 供左侧导航读取
        title: '员工',
        icon: 'people'
      }
    },
    {
      path: 'detail/:id',
      component: () => import('@/views/employees/detail.vue'),
      hidden: true, // 不在左侧菜单栏显示
      meta: {
        title: '员工详情'
      }
    },
    {
      path: 'print/:id',
      component: () => import('@/views/employees/print.vue'),
      hidden: true,
      meta: {
        title: '打印', // 标记当前路由规则的中文名称，后续在做左侧菜单时使用
        icon: 'people'
      }
    }
  ]
}
