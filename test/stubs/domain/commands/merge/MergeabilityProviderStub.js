export class MergeabilityProviderStub {
    constructor() {
        this.getMergeability = jest.fn()
    }

    enqueueMergeability(mergeability) {
        this.getMergeability = jest.fn(() => mergeability)
    }
}
