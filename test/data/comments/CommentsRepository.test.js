import { Logger } from '../../../src/infrastructure/logging/Logger'
import { OctokitStub } from '../../stubs/data/OctokitStub'
import { FakePayloadFactory } from '../FakePayloadFactory'
import { LogLevel } from '../../../src/infrastructure/logging/LogLevel'
import { ConsolePrinter } from '../../../src/infrastructure/ConsolePrinter'
import { CommentsRepository } from '../../../src/data/comments/CommentsRepository'
import { Comment } from '../../../src/data/comments/models/Comment'

jest.mock('../../../src/infrastructure/logging/Logger')

const octokitStub = new OctokitStub()
const githubContext = { payload: FakePayloadFactory.create('bob', 'pull-request-assistant', 3) }
let repository = null

beforeEach(() => {
    Logger.getInstance.mockReturnValue(new Logger(LogLevel.DEBUG, new ConsolePrinter()))
    repository = new CommentsRepository(octokitStub, githubContext)
})

test('fetches reviews', async () => {
    const commentsResponse = [
        { user: { login: 'bob' }, body: 'comment text', id: 3 },
        { user: { login: 'dan' }, body: 'comment text', id: 4 }
    ]
    octokitStub.enqueueComments(commentsResponse)

    const comments = await repository.getCommentsForPr(3)

    expect(octokitStub.rest.issues.listComments).toBeCalledWith({
        owner: 'bob',
        repo: 'pull-request-assistant',
        issue_number: 3
    })
    expect(Logger.getInstance().debugCollapsibleObject)
        .toBeCalledWith('Octokit Response - Get Comments', commentsResponse)
    expect(comments).toStrictEqual([
        new Comment('bob', 'comment text', 3),
        new Comment('dan', 'comment text', 4)
    ])
})

test('edits comment', async () => {
    const commentsResponse = { user: { login: 'bob' }, body: 'new comment text', id: 3 }
    octokitStub.enqueueEditComments(commentsResponse)

    const comments = await repository.editComment(3, 'new comment text')

    expect(octokitStub.rest.issues.updateComment).toBeCalledWith({
        owner: 'bob',
        repo: 'pull-request-assistant',
        comment_id: 3,
        body: 'new comment text'
    })
    expect(Logger.getInstance().debugCollapsibleObject)
        .toBeCalledWith('Octokit Response - Edit Comment', commentsResponse)
    expect(comments).toStrictEqual(new Comment('bob', 'new comment text', 3))
})

