import { CommandHandler } from "../../Boundary/CommandHandlers/CommandHandler";
import { middlewareList } from '../Middleware/MiddlewareList';
const path = require("path");

export class ExecutionBus
{
    async execute(...commands:any): Promise<any>
    {
        let collectedData = {};

        for (let command of commands) {
            await this.runMiddleware(command);
            const commandName = command.constructor.name;
            const handler = this.getHandler(commandName, command.dir);
            collectedData[commandName] = await handler.handle(command);
        }

        if (Object.keys(collectedData).length > 1) return collectedData;
        else return collectedData[commands[0].constructor.name];
    }

    getHandler(commandName:string, commandDir:string): CommandHandler
    {
        const handlerName = `${commandName}Handler`;
        const handlerRef = require(`../../Boundary/CommandHandlers/${commandDir}/${handlerName}`);
        return new handlerRef[handlerName]();
    }

    async runMiddleware(command:any)
    {
        for (let middleware of middlewareList) {
            await (new middleware()).execute(command);
        }
    }
}
export const bus = new ExecutionBus();