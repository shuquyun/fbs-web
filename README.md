# Galaxy Web前端工程

## setup

```
  npm config set registry http://registry.npm.terminus.io/
  npm install
  npm i @terminus/shepherd -g
  npm i @terminus/herd -g
  shepherd
  herd
```
or

support use `pm2`

  * `npm i -g pm2`
  * `pm2 start ecosystem.json`

then open browser and visit *localhost:8080*

### workflow

  1. 新项目 `example` 从 `feebas` 中fork出去成为独立的实施项目演进
  2. `git clone example` -> `cd example` 进入本地项目目录
  3. 执行 `git remote add upstream git@git.terminus.io:production/feebas.git`，增加 upstream remote
  4. 执行 `git pull upstream master` 更新 `feebas master` 至 `example` 本地仓库，解决冲突
  5. `git commit` && `git push origin master`

### 开发方式

### TODO 所有组件的描述和功能列表

#### 一次开发（新组件）

  * 在 `components` 下功能模块下新建一个组件文件夹

  * 新建 `view.hbs`, `view.coffee`, `view.scss`

  * `view.hbs` demo:

    ``` hbs
      {{#component "component-demo js-comp"}}
        show something
      {{/component}}
    ```

  * `view.coffee` demo:

    ``` coffeescript
      class Demo
        constructor: ->
          # 申明变量
          @bindEvent()

        bindEvent: =>
          # 绑定事件

        someFunctions: =>

      module.exports = Demo
    ```

  * `view.scss` demo:

    ``` scss
      .components-demo {
        # some styles
      }
    ```

#### 二次开发（修改，复写原有组件）

##### 复写组件内容 -- html

  复写`view.hbs` 是 full overwrite 的

  在 `components` 目录下建立同路径的组件文件夹，新建`view.hbs`，在`view.hbs`中写入想展现的组件代码，`view.hbs` 会完全覆盖components_vendor中同名路径组件的代码

##### 复写backend_templates下的template

  与view.hbs一致，如：

  `components_vendor/trade/buyer/shop_cart/backend_templates/_shop_part.hbs`:

  ``` hbs

    {{> component:trade/buyer/shop_cart/backend_templates/_shop_info}}

    {{> component:trade/buyer/shop_cart/backend_templates/_shop_activity}}

    {{#each cartItems}}
      {{> component:trade/buyer/shop_cart/backend_templates/_sku_part}}
    {{/each}}
  ```

  复写 `components/trade/buyer/shop_cart/backend_templates/_shop_part.hbs`:

  ``` hbs

    <div>这是测试代码，购物车页面会出现这句话</div>
  ```

##### 复写组件逻辑 -- js

  复写组件逻辑有两种场景，`full overwrite` 和 `extend`

##### 复写组件样式 -- css


#### 复写基础色系
  `app/styles/pokeball/_variables.scss` 中的变量为项目基础色系变量

  需要复写基础色系时

  在 `app/styles/pokeball/_theme.scss` 中复写需要自定义的变量，如：

  ``` scss
    // in _variables.scss
    // Color background
    $color-background: #f4f4f4 !default;
  ```
  复写：

  ``` scss
    // in _theme.scss
    // Color background
    $color-background: #f5f5f5;
  ```


### 模块与组件

#### 模块
`components` 下第一层目录为模块目录，不应该有单个文件单独出现在第一层目录的情况，此处模块应是后端项目模块的超集，例如 `trade`，`shop`，`user`，`settlement`等;

各个模块的释义如下：
  `items`: 商品模块
  `trade`: 交易模块
  `shop`: 店铺模块
  `user`: 用户模块
  `settlement`: 结算模块
  `market`: 营销模块
  `pay`: 支付模块
  `system`: 站点管理相关模块（后续可能合并至其他模块，看新装修）
  `eevee`: 装修基础组件模块（后续可能合并至其他模块，看新装修）
  `common`: 跨模块多复用的业务组件集合模块，如 `地址选择器`
  `design`: 运营装修组件集合模块
  `utils`: 前端项目基础文件和无业务工具集合

每个模块下应该是组件集合和module的资源等，例如`trade`模块的目录结构：
```
  ├── buyer
  │   ├── comment
  │   ├── comments_manage
  │   ├── item_snapshot
  │   ├── order_detail
  │   ├── order_manage
  │   ├── pre_order
  │   ├── shop_cart
  │   ├── sku_return
  │   ├── sku_return_detail
  │   └── trade_success
  ├── resources
  │   └── images
  ├── seller
  │   ├── order_detail
  │   ├── order_manage
  │   ├── sku_return
  │   └── sku_return_detail
  ├── styles
  └── views
```

resources,styles,views为模块内资源，后续可能会有调整。

#### 组件



