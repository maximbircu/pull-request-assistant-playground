export class MergeCommitMessageTemplateProvider {
    #config
    #workingDirectory
    #fileReader

    constructor(config, workingDirectory, fileReader) {
        this.#config = config
        this.#workingDirectory = workingDirectory
        this.#fileReader = fileReader
    }

    readTemplate() {
        let templatePath = this.#config.commitMessageTemplatePath
        if (templatePath === '/assets/commands/merge/commit-template.txt') {
            templatePath = `${this.#workingDirectory}${templatePath}`
        }
        if (!this.#fileReader.fileExists(templatePath)) {
            throw Error(`The provided "commit_message_template_path:${templatePath}" doesn't exist`)
        }
        return this.#fileReader.readFileSync(templatePath)
    }
}
