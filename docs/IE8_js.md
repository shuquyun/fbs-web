# IE8 JS
#### 1.jquery不要用 ~~mouseover~~、 ~~mouseout~~ 用 `mouseenter`、`mouseleave`
```
  $(a).on(’mouseenter’, function(){});
  $(a).on(‘mouseleave’, function(){});
```

#### 2.上传组件 IE8 不支持 `display:none` 的`input:file`

#### 3.IE8下 `href='javascript:void(0);'` 依然触发 windowBeforeLoad
```
  <a href='###'>用###不会触发windowBeforeLoad</a>
```

#### 4.IE8不支持new Date方法

#### 5.settimeout IE8 不支持3个或3个以上参数
```
  setTimeout(->
    function(arg)
  , 5000)
```

#### 6.页面animate滑动必须要选择("html, body")
```
  $("html, body").animate({scrollTop: $("window").offset().top})
```
