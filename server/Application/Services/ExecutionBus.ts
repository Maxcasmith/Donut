import { CommandHandler } from "../../Boundary/CommandHandlers/CommandHandler";
import { middlewareList } from '../Middleware/MiddlewareList';

export class ExecutionBus
{
    async execute(command:any): Promise<any>
    {
        await this.runMiddleware(command);
        const commandName = command.constructor.name;
        const handler = this.getHandler(commandName);
        return await handler.handle(command);
    }

    getHandler(commandName:string): CommandHandler
    {
        const handlerName = `${commandName}Handler`;
        const handlerRef = require(`../../Boundary/CommandHandlers/${handlerName}`);
        return new handlerRef[handlerName]();
    }

    async runMiddleware(command:any)
    {
        for (let middleware of middlewareList) {
            await (new middleware()).execute(command);
        }
    }
}