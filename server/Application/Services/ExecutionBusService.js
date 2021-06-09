import { middlewareList } from '../Middleware/MiddlewareList.js'

export class ExecutionBusService
{
    constructor(request)
    {
        this.request = request;
    }

    /**
     * @param {*} command 
     */
    async execute(command)
    {
        for (let middleware of middlewareList) {
            await (new middleware()).execute(this.request, command);
        }
        return await command.execute();
    }
}