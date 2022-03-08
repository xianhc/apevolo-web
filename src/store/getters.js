const getters = {
  size: state => state.app.size,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  roles: state => state.user.roles,
  user: state => state.user.user,
  loadMenus: state => state.user.loadMenus,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  baseApi: state => state.api.baseApi,
  updateAvatarApi: state => state.api.updateAvatarApi,
  fileUploadApi: state => state.api.fileUploadApi,
  sidebarRouters: state => state.permission.sidebarRouters
}
export default getters
