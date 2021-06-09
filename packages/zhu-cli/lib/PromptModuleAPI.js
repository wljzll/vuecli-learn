class PromptModuleAPI {
    constructor(creator) {
        this.creator = creator
    }
    // 在要选择的特性choices选项中添加待选项
    injectFeature(feature) {
        this.creator.featurePrompt.choices.push(feature)
    }

    injectPrompt(prompt) {
        this.creator.injectedPrompts.push(prompt)
    }

    onPromptComplete(cb) {
        this.creator.promptCompleteCbs.push(cb)
    }
}
module.exports = PromptModuleAPI;