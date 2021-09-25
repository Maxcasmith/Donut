import { ExampleFactory } from "../Factories/ExampleFactory";
import { bus } from "../Services/ExecutionBus";
export class ExampleController
{
    factory:ExampleFactory;

    constructor()
    {
        this.factory = new ExampleFactory();
    }

    async hello(req:any): Promise<string>
    {
        return "Hello World";
    }

    async example(req:any): Promise<any>
    {
        const commands = await this.factory.hydrateCommand(req.body);
        const data = await bus.execute({ commands, data: { message: "HELLO WORLD" } });
        return data;
    }
}