import {
    DryRunMessageTemplateProvider
} from '../../../../../../src/domain/commands/merge/message-builders/dry-run/DryRunMessageTemplateProvider'
import { FileReaderStub } from '../../../../../stubs/infrastructure/utils/FileReaderStub'

const fileReaderStub = new FileReaderStub()

test('reads proper dry run template file', () => {
    const templateProvider = new DryRunMessageTemplateProvider(fileReaderStub, '/workingDir')

    templateProvider.dryRunTemplatePath()

    expect(fileReaderStub.readFileSync)
        .toBeCalledWith('/workingDir/assets/commands/merge/dry-run-template.txt')
})

test('reads proper dry run rebase template file', () => {
    const templateProvider = new DryRunMessageTemplateProvider(fileReaderStub, '/workingDir')

    templateProvider.dryRunRebaseTemplatePath()

    expect(fileReaderStub.readFileSync)
        .toBeCalledWith('/workingDir/assets/commands/merge/dry-run-rebase-template.txt')
})
