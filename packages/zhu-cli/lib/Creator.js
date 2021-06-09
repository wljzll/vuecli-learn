const inquirer = require("inquirer");
const { defaults } = require("./options");
const PromptModuleAPI = require("./PromptModuleAPI");
const isManualMode = (answers) => answers.preset === "__manual__";

class Creator {
  /**
   *
   * @param {*} name 创建的项目名称
   * @param {*} context 工作目录
   * @param {*} promptModules 调用方法 添加特性
   */
  constructor(name, context, promptModules) {
    this.name = name;
    this.context = context;
    const { presetPrompt, featurePrompt } = this.resolveIntroPrompts(); // 获取预设和特性
    // 预设 preset
    // {
    //     name: 'preset',
    //     type: 'list',
    //     message: 'Please pick a preset:',
    //     choices: [
    //       { name: 'Default', value: 'default' },
    //       { name: 'Default (Vue 3)', value: '__default_vue_3__' },
    //       { name: 'Manually select features', value: '__manual__' }
    //     ]
    //   }
    this.presetPrompt = presetPrompt;

    // 特性
    // {
    //     name: 'features',
    //     when: [Function: isManualMode],
    //     type: 'checkbox',
    //     message: 'Check the features needed for your project:',
    //     choices: [],
    //     pageSize: 10
    //   }
    this.featurePrompt = featurePrompt;

    this.injectedPrompts = []; // 当你选择了某个特性后，这个特性可能会添加新的选择项：unit test jest mocha
    this.promptCompleteCbs = []; //当选择完所有的选项后执行的回调数组
    // 创建PromptModuleAPI实例 实例上有三个方法injectFeature/injectPrompt/onPromptComplete
    const promptAPI = new PromptModuleAPI(this);
    // 传入PromptModuleAPI实例 调用promptAPI上的三个方法 添加preset、feature
    promptModules.forEach((m) => m(promptAPI));
  }
  // create => promptAndResolvePreset => resolveFinalPrompts/resolvePreset
  // 开始创建项目
  async create() {
    // { plugins: {}, vueVersion: '3' }
    let preset = await this.promptAndResolvePreset();
    
  }
  resolveFinalPrompts() {
    this.injectedPrompts.forEach((prompt) => {
      const originalWhen = prompt.when || (() => true);
      prompt.when = (answers) => {
        return isManualMode(answers) && originalWhen(answers);
      };
    });
    const prompts = [
      this.presetPrompt,
      this.featurePrompt,
      ...this.injectedPrompts,
    ];
    // [
    //     {
    //       name: 'preset',
    //       type: 'list',
    //       message: 'Please pick a preset:',
    //       choices: [ [Object], [Object], [Object] ]
    //     },
    //     {
    //       name: 'features',
    //       when: [Function: isManualMode],
    //       type: 'checkbox',
    //       message: 'Check the features needed for your project:',
    //       choices: [ [Object] ],
    //       pageSize: 10
    //     },
    //     {
    //       name: 'vueVersion',
    //       when: [Function],
    //       message: 'Choose a version of Vue.js that you want to start the project with',
    //       type: 'list',
    //       choices: [ [Object], [Object] ],
    //       default: '2'
    //     }
    //   ]
    return prompts;
  }
  /**
   * 根据用户的选择 组织preset选项
   * @param {*} answers 用户选择的选项
   * @returns 
   */
  async promptAndResolvePreset(answers = null) {
    if (!answers) {
      // { preset: '__manual__', features: [ 'vueVersion' ], vueVersion: '3' }
      answers = await inquirer.prompt(this.resolveFinalPrompts());
    }

    let preset;
    // 如果用户选择了预设并且不是手动选择 "__manual__" 也就是选择了 vue2或者vue3的默认预设
    if (answers.preset && answers.preset !== "__manual__") {
      preset = await this.resolvePreset(answers.preset);
    } else { // 如果是手动选择
      preset = {
        plugins: {},
      };
      answers.features = answers.features || [];
      this.promptCompleteCbs.forEach((cb) => cb(answers, preset));
    }
    return preset;
  }
  // 获取选择的预设
  async resolvePreset(name) {
    const savedPresets = this.getPresets();
    return savedPresets[name];
  }
  // 获取默认的特性和预设
  getPresets() {
    // {
    //     default: {
    //       vueVersion: '2',
    //       useConfigFiles: false,
    //       cssPreprocessor: undefined,
    //       plugins: { '@vue/cli-plugin-babel': {}, '@vue/cli-plugin-eslint': [Object] }
    //     },
    //     __default_vue_3__: {
    //       vueVersion: '3',
    //       useConfigFiles: false,
    //       cssPreprocessor: undefined,
    //       plugins: { '@vue/cli-plugin-babel': {}, '@vue/cli-plugin-eslint': [Object] }
    //     }
    //   }
    return Object.assign({}, defaults.presets);
  }
  resolveIntroPrompts() {
    let presets = this.getPresets();
    const presetChoices = Object.entries(presets).map(([name]) => {
      let displayName = name;
      if (name === "default") {
        displayName = "Default";
      } else if (name === "__default_vue_3__") {
        displayName = "Default (Vue 3)";
      }
      return {
        name: `${displayName}`,
        value: name,
      };
    });
    // 预设
    const presetPrompt = {
      name: "preset",
      type: "list",
      message: `Please pick a preset:`,
      choices: [
        ...presetChoices,
        {
          name: "Manually select features",
          value: "__manual__",
        },
      ],
    };
    // 特性 初始化时是空的
    const featurePrompt = {
      name: "features",
      when: isManualMode,
      type: "checkbox",
      message: "Check the features needed for your project:",
      choices: [],
      pageSize: 10,
    };
    return {
      presetPrompt,
      featurePrompt,
    };
  }
}

module.exports = Creator;
