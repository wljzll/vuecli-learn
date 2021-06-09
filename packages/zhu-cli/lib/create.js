let path = require("path");
const Creator = require("./Creator");
const { getPromptModules } = require("./util/createTools");
/**
 * 创建项目
 * @param {*} projectName 项目名称
 */
async function create(projectName) {
  let cwd = process.cwd(); // 获取当前的工作目录
  let name = projectName; // 项目名
  let targetDir = path.resolve(cwd, name);
  // 获取vueVersion相关的注入特性的函数 这个函数接收PromptModuleAPI的实例作为参数 
  let promptModules = getPromptModules(); // 获取要弹出的选项 就是vueVersion中的函数
  // 创建Creator实例
  const creator = new Creator(name, targetDir, promptModules);
  await creator.create();
}
module.exports = (...args) => {
  return create(...args).catch((err) => {
    console.log(err);
  });
};
