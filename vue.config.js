const path = require('path');

function resolve (dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  //webpack-dev-server打包的内容是放在内存中的，
  //这些打包后的资源对外的的根目录就是publicPath
  //换句话说，这里我们设置的是打包后资源存放的位置
  publicPath: './',
  devServer: {
    // can be overwritten by process.env.HOST
    host: '0.0.0.0',  
    port: 8080
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('src', resolve('src'))
      .set('common', resolve('src/common'))
      .set('components', resolve('src/components'));
  },
  //build之后的图标名字
  pluginOptions: {
    electronBuilder: {
        builderOptions: {
            win: {
                icon: './public/app.ico'
            },
            mac: {
                icon: './public/app.png'
            },
            productName: 'AppDemo'
        }
    }
}

};