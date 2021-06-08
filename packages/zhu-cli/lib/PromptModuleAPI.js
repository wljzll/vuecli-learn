class PromptModuleAPI {
    constructor(creator) {
        this.creator = creator
    }
    // 在特性里添加每个特性
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