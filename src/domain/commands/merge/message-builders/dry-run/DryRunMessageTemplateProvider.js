export class DryRunMessageTemplateProvider {
    #fileReader
    #workingDirectory

    constructor(fileReader, workingDirectory) {
        this.#fileReader = fileReader
        this.#workingDirectory = workingDirectory
    }

    dryRunTemplatePath() {
        return this.#fileReader.readFileSync(
            `${this.#workingDirectory}/assets/commands/merge/dry-run-template.txt`
        )
    }

    dryRunRebaseTemplatePath() {
        return this.#fileReader.readFileSync(
            `${this.#workingDirectory}/assets/commands/merge/dry-run-rebase-template.txt`
        )
    }
}
