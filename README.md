# 管理后台前端脚手架


## 特性

-   基于[react](https://github.com/facebook/react)，[ant-design](https://github.com/ant-design/ant-design)，[dva](https://github.com/dvajs/dva)，[Mock](https://github.com/nuysoft/Mock) 。
-   基于Antd UI 设计语言，提供常用组件。
-   基于[dva](https://github.com/dvajs/dva)动态加载 Model 和路由，按需加载。
-   使用[roadhog](https://github.com/sorrycc/roadhog)本地调试和构建，其中Mock功能实现脱离后端独立开发。
-   浅度响应式设计。


## 开发构建

### 目录结构

```bash
├── /dist/           # 项目输出目录
├── /src/            # 项目源码目录
│ ├── /components/   # UI组件及UI相关方法
│ │ ├── skin.less    # 全局样式
│ │ └── vars.less    # 全局样式变量
│ ├── /routes/       # 路由组件
│ │ └── app.js       # 路由入口
│ ├── /models/       # 数据模型
│ ├── /services/     # 数据接口
│ ├── /themes/       # 项目样式
│ ├── /mock/         # 数据mock
│ ├── /utils/        # 工具函数
│ │ ├── config.js    # 项目常规配置
│ │ ├── menu.js      # 菜单及面包屑配置
│ │ ├── config.js    # 项目常规配置
│ │ ├── request.js   # 异步请求函数
│ │ └── theme.js     # 项目需要在js中使用到样式变量
│ ├── route.js       # 路由配置
│ ├── index.js       # 入口文件
│ └── index.html
├── package.json     # 项目信息
├── .eslintrc        # Eslint配置
└── .roadhogrc.js    # roadhog配置
```

文件夹命名说明:

-   components：组件（方法）为单位以文件夹保存，文件夹名组件首字母大写（如`DataTable`），方法首字母小写（如`layer`）,文件夹内主文件与文件夹同名，多文件以`index.js`导出对象（如`./src/components/Layout`）。
-   routes：页面为单位以文件夹保存，文件夹名首字母小写（特殊除外，如`UIElement`）,文件夹内主文件以`index.js`导出，多文件时可建立`components`文件夹（如`./src/routes/logistics`），如果有子路由，依次按照路由层次建立文件夹。

### 快速开始


克隆项目文件:

    git clone git@code.ixiye.com:51ida/ida-web.git

1、安装最新版Node.js（v7以上）
2、设置国内淘宝npm仓库 命令 npm config set registry https://registry.npm.taobao.org
3、进入目录安装依赖: npm i 或者 yarn install
4、开发：
```bash
npm run dev
打开 http://localhost:8000 即可看到项目运行效果
```

代码检测：

```bash
npm run lint
```

### 项目部署
构建：

```bash
  npm run build
  将会生成dist目录
```

因为项目中使用到了browserHistory，所以build之后需要部署到服务器上

nginx配置示例：

```
  server
  {
    listen       666;
    server_name 47.92.30.98;
    root  /home/www/admin/dist;

    location /api {
       proxy_pass http://localhost:8000/api;
    }

    location / {
        index  index.html;
        try_files $uri $uri/ /index.html;
    }
  }
```
