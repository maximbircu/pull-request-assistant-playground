export class DryRunMessageBuilderStub {
    constructor() {
        this.buildMessage = jest.fn()
    }

    enqueueMessage(message) {
        this.buildMessage = jest.fn(() => message)
    }
}
