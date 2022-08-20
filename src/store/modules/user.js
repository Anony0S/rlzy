import { getUserInfo, login, getDetaliInfoById } from '@/api/user'
import { setToken, getToken, removeToken, setTimeStamp } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: getToken(),
    // 此处设置为空对象,防止读取报错
    userInfo: {}
  },
  mutations: {
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    removeToken(state) {
      state.token = null
      removeToken()
    },
    // 设置用户信息
    setUserInfo(state, userInfo) {
      // state.userInfo = userInfo // 可以做到响应式
      state.userInfo = { ...userInfo } // 可以做到响应式
    },
    // 删除用户信息
    removeUserInfo(state) {
      state.userInfo = {}
    }
  },
  actions: {
    // 通过接口获取 token
    // commit setToken
    async login({ commit }, data) {
      const res = await login(data)
      commit('setToken', res)
      // 拿到 token 登录成功，存时间戳
      setTimeStamp()
    },
    // 获取用户信息
    async getUserInfo(context) {
      const res = await getUserInfo()
      const detailRes = await getDetaliInfoById(res.userId)
      context.commit('setUserInfo', { ...res, ...detailRes })
      return res // TODO: 这里为什么要返回, 为后面买下伏笔
    },
    // 登出
    logout(context) {
      // 删除 Token, 注意: 不仅仅删除了 vuex 中的, 还删除了缓存中的
      context.commit('removeToken')
      // 删除用户资料
      context.commit('removeUserInfo')
    }
  }
}
