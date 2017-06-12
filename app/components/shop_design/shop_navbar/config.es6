import {definedProperty, ImagePropery, PropertyBr, definedImageProperty, definedDialogProperty} from 'eevee/config/properties';

export default function() {
  this.baseInfo.name = "导航栏";
  this.baseInfo.description = "店铺导航栏，可以配置多个商品关键字进行导购";

  this.configs.ext = {
    name: "组件设置"
  }

  let tagsProperty = definedProperty(this, {
    name: "tags",
    label: "关键字",
    description: "请输入商品关键字，多个关键字之间用空格分隔，最多支持 7 个",
    type: "text",
    useData: true,
    reRender: true,
    get: function() {
      let data = this._get();
      return !data ? "" : data.join(" ");
    },
    reduce: function(config, value) {
      value = value.trim();
      let tags = []
      if(value !== "") {
        tags = value.split(/\s+/);
        if(tags.length > 7) {
          Essage.show({
            message: "最多支持 7 个关键字，超出部分将被忽略",
            status: "warning",
          }, 2000);
          tags = tags.slice(0, 7);
        }
      }
      return this._reduce(config, tags);
    }
  });

  let countProperty = definedProperty(this, {
    name: "count",
    label: "频道分类个数",
    description: "店铺频道个数",
    type: "text",
    useData: true,
    reRender: true
  });

  let navProps = [];
  let count = countProperty.get();
  if(count) {
    _.times(count, i => {
      let index = i + 1;
      navProps.push(definedProperty(this, {
        name: `navs[${i}].title`,
        label: `第${index}个标题`,
        desc: `第${index}个标题内容`,
        type: "text",
        useData: true,
        reRender: true
      }));

      navProps.push(definedProperty(this, {
        name: `navs[${i}].href`,
        label: `第${index}个标题链接`,
        desc: `第${index}个标题链接地址`,
        type: "text",
        useData: true,
        reRender: true
      }));
    });
  }

  this.registerConfigProperty("ext", tagsProperty, countProperty);
  this.registerConfigProperty.apply(this, ["ext"].concat(navProps));
}
