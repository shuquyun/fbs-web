import Properties from "eevee/config/properties";

module.exports = ()=>
  this.baseInfo.name = "帮助中心";
  this.baseInfo.description = "帮助中心组件";

  this.configs.ext = {
    name: "组件设置"
  }

  this.registerConfigProperty("ext");
