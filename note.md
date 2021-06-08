## http://www.zhufengpeixun.com/grow/html/133.vue-cli.html#t241.4%20lerna%20vs%20yarn
`
Vue CLI v4.5.13
✨  Creating project in C:\Users\wbzoulele\Desktop\study\hello-world. // 创建hello-world目录
�  Initializing git repository...    // 调用git init命令
⚙️  Installing CLI plugins. This might take a while...  // 安装插件


> core-js@3.14.0 postinstall C:\Users\wbzoulele\Desktop\study\hello-world\node_modules\core-js
> node -e "try{require('./postinstall')}catch(e){}"


> ejs@2.7.4 postinstall C:\Users\wbzoulele\Desktop\study\hello-world\node_modules\ejs
> node ./postinstall.js

added 1207 packages from 639 contributors in 77.235s

68 packages are looking for funding
  run `npm fund` for details

�  Invoking generators... // 调用生成器 每个插件都会有一个生成器函数 调用它可以产出文件，或者修改配置
�  Installing additional dependencies... // 安装额外的依赖

added 3 packages from 1 contributor in 11.138s

68 packages are looking for funding
  run `npm fund` for details

⚓  Running completion hooks...

�  Generating README.md... // 生成readme文件

�  Successfully created project hello-world.
�  Get started with the following commands:

 $ cd hello-world
 $ npm run serve

`