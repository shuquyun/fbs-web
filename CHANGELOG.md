# CHANGELOG

## 1.1.3
- 修复IE8支付成功与否确认框的边框问题
- 登录页面错误提示优化
- 店铺页面导航高亮修复
- 订单预览页发票修改处样式修复
- 商品详情页累计评价处样式修复
- 筛选filter时剔除type为submit的input

## 1.1.2
- 增加了前端helper withPerm，用法与后端withPerm相同
- 对应后端版本号为4.5.RELEASE

## 1.1.1
- 调整了Cookie的调用方式,js中不再需要new Cookie，直接Cookie.addCookie就行
- 增加一个 default helper   {{default a b c}}
- 新增前端模板helper：withPerm
- 一些已知的bug fix
- 更新 `parana-front-base` 依赖，升级到1.1.1
- 对应后端版本号为4.5.RELEASE

## 1.1.0
- 修复了二次开发时i18n配置需要全量覆盖的问题，现在可以增量覆盖了

## 1.0.8
- 新增装修系统权限
- 删除几个无用的views
- 更新 `parana-front-base` 依赖，升级到1.0.8
- 对应后端版本号为4.5.RELEASE
- 修复一些列已知bug

## 1.0.7

- 调整了 `front config` 和 `back config` 结构，不需要缩进两格了，app/files 下的 config 文件结构也和组件下的 config 文件保持一致
- 更新 `parana-front-base` 依赖，升级到1.0.7
- **注意：这个升级必须要 `parana-front-base` 1.0.7**，否则是一个**不兼容**的升级

## 1.0.6

- 对应后端版本号为4.5.RELEASE
- 修复一些列已知bug

## 1.0.5

- 对应后端版本号为4.5.RELEASE
- 结算部分代码重构

## 1.0.4

- 对应后端版本号为4.4.RELEASE
- 根据handlebars对数据层级bug的调整，调整项目中的代码
- herd请更新到0.3.25及以上

## 1.0.3

- 对应后端版本号为4.4.RELEASE

- 调整json2.js的CDN路径

## 1.0.2

- 调整node依赖关系，加速打包
