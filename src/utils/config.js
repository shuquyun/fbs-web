const APIV1 = '/api/v1'
const APIVM = '/api/vm'

module.exports = {
  name: '管理员后台',
  prefix: 'antdAdmin',
  footerText: '管理员后台  © 2018',
  logo: '/images/logo.png',
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  YQL: [],
  CORS: [],
  openPages: ['/login','/register','/resetpwd'],
  mockApiPrefix: APIV1,
  mockApiPrefix: APIVM,
  amapKey: '7a5d28e11f78ec9bc4e7c21170cfe007',//高德地图key
  api: {
    codeImgUrl:`${APIV1}/auth/captcha`,
    codeMobile:`${APIV1}/common/code`,

    //首页数据接口地址
    dashboard: `${APIV1}/index`,


    //用户中心接口地址
    userLogin: `${APIV1}/auth/login`,
    userLogout: `${APIV1}/auth/logout`,
    userResetpwd: `${APIV1}/auth/reset/password`,
    user: `${APIV1}/auth/user`,
    auth: `${APIV1}/auth`,
    ucUser: `${APIV1}/ucenter/ucUser`,
    userAdmin: `${APIV1}/ucenter/adminInfo`,
    basePermission:`${APIV1}/ucenter/adminPermission`,
    baseNotice: `${APIV1}/ucenter/adminNotice`,
    baseMessage: `${APIV1}/ucenter/ucUserMessage`,
    userRole: `${APIVM}/userRole`,
    menus: `${APIV1}/ucenter/adminPermission`,
    baseRole: `${APIV1}/ucenter/adminRole`,
    rolePermission: `${APIV1}/ucenter/adminRolePermission`,



  },

}
