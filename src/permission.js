// 权限拦截在路由跳转，导航守卫

import router from './router'
// 引入 store 实例，和组件中的 this.$store 是一回事
import store from './store'
// 引入进度条
import nProgress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'

// 不需要导出，因为只需要让代码执行即可
// 前置守卫
// next 是前置守卫必须必须必须执行的钩子 next 必须执行， 如果不执行 页面就死了
// next() 放过
// next(false) 跳转终止
// next(地址) 跳转到某个地址

// 定义白名单
const whiteList = ['/login', '/404']
// 前置路由守卫
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  nProgress.start()
  if (store.getters.token) {
    // 如果有token
    if (to.path === '/login') {
      // 如果访问的是登录页 跳转到主页
      next('/')
    } else {
      // 只有放行的时候才获取用户资料
      if (!store.getters.userId) {
        // 如果没有 userId 则获取用户资料, 注意进行同步操作
        const {
          roles: { menus }
        } = await store.dispatch('user/getUserInfo')
        store.dispatch('permission/filterRoutters', menus)
        // 明确要去往的地址，不然造成白屏（动态路由缺陷）
        next(to.path)
      }
      next()
    }
  } else {
    // 没有 token 的情况下
    // 在白名单内
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
  nProgress.done()
})
// 后置路由守卫
router.afterEach(() => {
  // 关闭进度条
  nProgress.done()
})
