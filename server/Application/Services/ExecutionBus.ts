import { middlewareList } from '../Middleware/MiddlewareList';
export class ExecutionBus
{
    async execute(...commands:any): Promise<any>
    {
        let collectedData = {};

        for (let command of commands) {
            await this.runMiddleware(command);
            collectedData[command.constructor.name] = await command.run();
        }

        if (Object.keys(collectedData).length > 1) return collectedData;
        else return collectedData[commands[0].constructor.name];
    }

    async runMiddleware(command:any)
    {
        for (let middleware of middlewareList) {
            await (new middleware()).execute(command);
        }
    }
}
export const bus = new ExecutionBus();