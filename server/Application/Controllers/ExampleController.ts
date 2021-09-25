import { ExampleFactory } from "../Factories/ExampleFactory";
import { bus } from "../Services/ExecutionBus";
export class ExampleController
{
    factory:ExampleFactory;

    constructor()
    {
        this.factory = new ExampleFactory();
    }

    async hello(req:any): Promise<any>
    {
        const message = "HELLO WORLD";
        
        const commands = await this.factory.hydrateCommand(req.body);
        const data = await bus.execute({ commands, data: { message }, lanes: 'test' });
        return data;
    }
}