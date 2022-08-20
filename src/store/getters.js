const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token, // 建立 Token 的快捷访问 开发子模块的属性给别人看 给别人用
  name: (state) => state.user.userInfo.username, // 建立用户名称的映射
  userId: (state) => state.user.userInfo.userId, // 建立用户ID的映射
  staffPhoto: (state) => state.user.userInfo.staffPhoto
}
export default getters
