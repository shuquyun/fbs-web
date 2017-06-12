const cookie = require("utils/plugins/cookie")

module.export = () => {
  if (cookie.get("cwebp") === "") {
    const img = new Image()

    img.onload = img.onerror = () => {
      cookie.set("cwebp", img.height == 1, 30, document.domain)
    }

    img.src = "data:image/webp;base64,UklGRiYAAABXRUJQVlA4IBoAAAAwAQCdASoBAAEAAAAMJaQAA3AA/v89WAAAAA=="
  }
}
