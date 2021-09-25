import { Command } from '../../Boundary/Commands/Command';
import { middlewareList } from '../Middleware/MiddlewareList';

export class ExecutionBus
{
    async execute(options:ExecutionBusOptions): Promise<any>
    {
        let commands:any = (options.commands.constructor.name == "Array") 
            ? options.commands
            : [ options.commands ];
        
        let collectedData = {};

        for (let command of commands) {
            await this.runMiddleware(command, options.data, options.lanes);
            collectedData[command.constructor.name] = await command.run();
        }

        if (Object.keys(collectedData).length > 1) return collectedData;
        else return collectedData[commands[0].constructor.name];
    }

    async runMiddleware(command:Command, data:any|null = null, lanes:string[]|null = null)
    {
        const middlewares = (lanes != null) 
            ? middlewareList
                .filter(m => lanes.includes(m.lane) || m.lane == null)
                .map(m => m.middleware)
            : middlewareList.map(m => m.middleware);

        for (let middleware of middlewares) {
            await (new middleware()).execute(command, data);
        }
    }
}
export const bus = new ExecutionBus();

interface ExecutionBusOptions
{
    commands: Command|Command[];
    data?:object,
    lanes?:string[];
}