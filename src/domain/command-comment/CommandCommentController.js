import { CommandComment } from './CommandComment'
import { CommandStatus } from './CommandStatus'
import { Logger } from '../../infrastructure/logging/Logger'

export class CommandCommentController {
    #config
    #commentsRepository
    #logger

    constructor(config, commentsRepository, logger) {
        this.#config = config
        this.#commentsRepository = commentsRepository
        this.#logger = logger
    }

    async init(prNumber) {
        const commands = await this.getCommands(prNumber)
        this._activeCommandComment = this.findActiveCommand(commands)
        await this.cancelWrongOrOldCommands(commands)
    }

    get activeCommandComment() {
        return this._activeCommandComment
    }

    findActiveCommand(commands) {
        return commands.reverse().find((command) => {
            return command.isPending && command.isLeftByAssistantController
        })
    }

    async cancelWrongOrOldCommands(commands) {
        for (const command of commands) {
            if (command === this._activeCommandComment) continue
            if (!command.isLeftByAssistantController) {
                await this.cancelAndTagControllers(command)
                continue
            }
            if (command.isPending) {
                await command.setStatus(CommandStatus.CANCELLED)
                    .catch((error) => {
                        Logger.getInstance().error(error)
                    })
            }
        }
    }

    async cancelAndTagControllers(command) {
        const controllers = this.#config.assistantControllers
            .map((controller) => `@${controller}`)
            .join(',')
        await command.setBodyAndStatus(
            `Only ${controllers} have rights to execute commands`,
            CommandStatus.CANCELLED
        ).catch((error) => {
            Logger.getInstance().error(error)
        })
    }

    async getCommands(prNumber) {
        const comments = await this.#commentsRepository.getCommentsForPr(prNumber)
        return comments
            .filter((comment) => comment.body.includes(this.#config.assistantName))
            .map((comment) => new CommandComment(
                comment,
                this.#config,
                this.#commentsRepository
            ))
    }
}
