import { FileReader } from '../../../../../../../src/infrastructure/utils/FileReader'

export class DryRunMessageTemplateProviderStub {
    #fileUtils = new FileReader()

    dryRunTemplatePath() {
        return this.#fileUtils.readFileSync(
            `./assets/commands/merge/dry-run-template.txt`
        )
    }

    dryRunRebaseTemplatePath() {
        return this.#fileUtils.readFileSync(
            `./assets/commands/merge/dry-run-rebase-template.txt`
        )
    }
}
