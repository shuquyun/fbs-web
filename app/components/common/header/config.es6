import {definedProperty, ImagePropery, PropertyBr, definedImageProperty, definedDialogProperty} from 'eevee/config/properties';

export default function() {
  this.baseInfo.name = "商品搜索框";
  this.baseInfo.description = "商品搜索栏及热词推荐";

  this.configs.ext = {
    name: "组件设置"
  }

  let siteLogoProperty = definedImageProperty(this, {
    name: "siteLogo",
    label: "Logo",
    description: "选择图片",
    useData: true,
    reRender: true,
    options: {
      "url": "<i class=\"fa fa-picture-o\"></i>"
    }
  });

  let hotWordProperty = definedProperty(this, {
    name: "hotwords",
    label: "热词",
    description: "可输入多个热词 中间用空格分隔 最多可输入7个",
    type: "text",
    useData: true,
    reRender: true,
    get: function() {
      let data = this._get();
      return !data ? "" : data.join(" ");
    },
    reduce: function(config, value) {
      value = value.trim();
      if(value == "") {
        this._set(undefined);
      } else {
        let hotwords = value.split(/\s+/);
        if(hotwords.length > 7) {
          Essage.show({
            message: "最多支持 7 个热词，超出部分将被忽略",
            status: "warning"
          } , 2000);
          hotwords = hotwords.slice(0, 7);
        }
      }
      this._reduce(config, hotwords);
    }
  });

  let positionProperty = definedProperty(this, {
    name: "position",
    label: "热词位置",
    description: "为热词选择展示位置",
    type: "radio",
    options: {
      "up": "搜索框上面",
      "down": "搜索框下面"
    },
    default: "down",
    useData: true,
    reRender: true
  });

  let placeholderProperty = definedProperty(this, {
    name: "placeholder",
    label: "预置搜索词",
    description: "搜索框内预置搜索词",
    type: "text",
    default: "请输入搜索词",
    useData: true,
    reRender: true
  });

  this.registerConfigProperty("ext", hotWordProperty, positionProperty, placeholderProperty, siteLogoProperty);
}
