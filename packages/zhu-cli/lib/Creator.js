const { defaults } = require("./options");
const isManualMode = (answers) => answers.preset === "__manual__";

class Creator {
  constructor(name, context, promptModules) {
    this.name = name;
    this.context = context;
    const { presetPrompt, featurePrompt } = this.resolveIntroPrompts(); // 获取预设和特性
    thi.presetPrompt = presetPrompt;
    this.featurePrompt = featurePrompt;

    this.injectedPrompts = []; // 当你选择了某个特性后，这个特性可能回添加新的选择项：unit test jest mocha
    this.promptCompleteCbs = []; //当选择完所有的选项后执行的回调数组
    const promptAPI = new PromptModuleAPI(this);
    promptModules.forEach((m) => m(promptAPI));
  }
  async create() {
    let preset = await this.promptAndResolvePreset();
    console.log("preset", preset);
  }
  resolveFinalPrompts() {
    this.injectedPrompts.forEach(prompt => {
        const originalWhen = prompt.when || (() => true)
        prompt.when = answers => {
            return isManualMode(answers) && originalWhen(answers)
        }
    })
    const prompts = [
        this.presetPrompt,
        this.featurePrompt,
        ...this.injectedPrompts,
    ]
    return prompts
}
  async promptAndResolvePreset(answers = null) {
    if (!answers) {
      answers = await inquirer.prompt(this.resolveFinalPrompts());
    }
    let preset;
    if (answers.preset && answers.preset !== "__manual__") {
      preset = await this.resolvePreset(answers.preset);
    } else {
      preset = {
        plugins: {},
      };
      answers.features = answers.features || [];
      this.promptCompleteCbs.forEach((cb) => cb(answers, preset));
    }
    return preset;
  }
  async resolvePreset (name) {
    const savedPresets = this.getPresets()
    return savedPresets[name];
}
  getPresets() {
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
