// vuex的权限模块
import router, { constantRoutes, asyncRoutes } from '@/router'
// vuex中的permission模块用来存放当前的 静态路由 + 当前用户的 权限路由
const state = {
  routes: constantRoutes // 所有人默认拥有静态路由
}
const mutations = {
  // newRoutes可以认为是 用户登录 通过权限所得到的动态路由的部分
  setRoutes(state, matchRoutes) {
    state.routes = [...constantRoutes, ...matchRoutes]
  }
}
const actions = {
  // 假设 menus 已经拿到了
  // 根据 menus 和 所有的 asyncRoutes 进行匹配属于这个用户的菜单
  // menus 权限里的 code 值
  filterRoutters(context, menus) {
    const routes = asyncRoutes.filter((ele) => menus.includes(ele.meta.id))
    context.commit('setRoutes', routes)
    // 动态添加过滤出来的路由
    router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
