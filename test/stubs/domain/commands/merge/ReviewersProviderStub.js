export class ReviewersProviderStub {
    constructor() {
        this.getReviewers = jest.fn()
    }

    enqueueReviewers(reviewers) {
        this.getReviewers = jest.fn(() => reviewers)
    }
}
