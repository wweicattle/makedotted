module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "./" : "./",
  configureWebpack: {
    resolve: {
      alias: {
        "assets": "@/assets",
        "network": "@/network",
        "components": "@/components",
        "common": "@/common",
        "views": "@/views",
        "utils": "@/utils"
      }
    }
  }
}