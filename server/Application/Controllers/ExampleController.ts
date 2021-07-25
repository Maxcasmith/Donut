import { ExampleFactory } from "../Factories/ExampleFactory";
import { bus } from "../Services/ExecutionBus";
export class ExampleController
{
    factory:ExampleFactory;

    constructor()
    {
        this.factory = new ExampleFactory();
    }

    async hello(req)
    {
        return "Hello World";
    }

    async example(req)
    {
        const command = await this.factory.hydrateCommand(req.body);
        const data = await bus.execute(command);
        return data;
    }
}