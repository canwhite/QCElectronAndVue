'use strict'


//electron模块提供的功能，都是通过命名空间暴露出来的
//eg:    (1)electron.app负责管理Electron应用程序的生命周期
//       (2)electron.BrowserWindow负责创建窗口
//        protocal和menu一个是代理，一个是菜单
import { app, protocol, BrowserWindow,Menu } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])



function createWindow () {
  // 创建浏览器窗口
  win = new BrowserWindow({ 
    width: 1200,
    height: 620,
    webPreferences: {
      webSecurity: false,//取消跨域限制
      nodeIntegration: true
    } })
  //让app窗口应用图标,这里的${__static}对应的是public目录
  //app.ico针对的是windows,app.png针对的是mac，
  //windows已经生效了，mac需要设置vue.config.js,并且build之后才会生效
  icon: `${__static}/app.ico`


  
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    //在开发环境下，加载开发环境下的url
    //我们在基本目录下新建一个index.html文件,然后在浏览器中输入http://localhost:8080访问.
    //会自动刷新界面
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    //在开发环境下，加载调试工具
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // 如果是生产环境，加载index.html文件
    win.loadURL('app://./index.html')
  }



  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })




  //创建菜单栏目
  createMenu()
}

//设置菜单栏目
function createMenu(){
    // darwin表示macOS，针对macOS的设置
    if (process.platform === 'darwin') {
        const template = [
        {
            label: 'App Demo',
            submenu: [
            {
                role: 'about'
            },
            {
                role: 'quit'
            }]
        }]
        let menu = Menu.buildFromTemplate(template)
        Menu.setApplicationMenu(menu)
    } else {
        // windows及linux系统
        Menu.setApplicationMenu(null)
    }

}



// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools()
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})


// 在开发者模式下，根据父进程的请求，干脆的
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
