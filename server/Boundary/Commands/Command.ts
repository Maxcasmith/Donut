import { CommandHandler } from "../CommandHandlers/CommandHandler";

export class Command
{
    dir:string = '..';

    constructor(dir:string)
    {
        this.dir = dir;
    }

    async run()
    {
        const handler = this.getHandler();
        return await handler.handle(this);
    }

    private getHandler(): CommandHandler
    {
        const handlerName = `${this.constructor.name}Handler`;
        const handlerRef = require(`../CommandHandlers/${this.dir}/${handlerName}`);
        return new handlerRef[handlerName]();
    }
}