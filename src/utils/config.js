const APIV1 = "/api/v1";
const APIV2 = "/api/v2";

module.exports = {
    name: "数趣云",
    prefix: "antdAdmin",
    footerText: "XXXXXX总管理后台  © 2018 杭州数趣云有限科技",
    logo: "/public/logo.svg",
    iconFontCSS: "/public/iconfont.css",
    iconFontJS: "/public/iconfont.js",
    CORS: [],
    openPages: ["/login"],
    apiPrefix: "/api/v1",
    APIV1,
    APIV2,
    api: {
        userLogin: `${APIV1}/user/login`, //登录 mock
        userLogout: `${APIV1}/user/logout`, //退出: Mock数据存在Bug
        userInfo: `${APIV1}/userInfo`, //用户详情
        user: `${APIV1}/users`, //用户信息 mock
        dashboard: `${APIV1}/dashboard`, //首页数据 mock
        menus: `${APIV1}/mock/menus`, //菜单 mock
        weather: `${APIV1}/weather`, //
        //登录注册验证码
        codeImgUrl: `${APIV1}/auth/captcha`,
        codeMobile: `${APIV1}/common/code`,
        //产品管理
        products: `${APIV1}/product`,
        //基础设置————————权限管理
        adminPermission: `${APIV1}/ucenter/adminPermission`, //获取权限列表
        ucenterSalaryUserPermission: `${APIV1}/ucenter/adminPermission/permissionList`, //菜单列表
        baseSettingRole: `${APIV1}/ucenter/adminRole/roleList`, //角色列表
        //基础设置————————角色管理
        adminRole: `${APIV1}/ucenter/adminRole`,
        adminRolePermission: `${APIV1}/ucenter/adminRolePermission`,
        //基础设置————————用户管理
        getUser: `${APIV1}/users`, //获取管理员列表
        //基础设置————————消息管理
        userMessage: `${APIV1}/ucenter/userMessage`,
        //基础设置————————公告管理
        baseNotice: `${APIV1}/ucenter/notice`,
    }
};
