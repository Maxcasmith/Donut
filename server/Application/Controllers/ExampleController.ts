import { ExampleFactory } from "../Factories/ExampleFactory";
import { ExecutionBus } from "../Services/ExecutionBus";

export class ExampleController
{
    private bus:ExecutionBus;

    constructor(bus:ExecutionBus) 
    {
        this.bus = bus;
    }

    async hello(req, res)
    {
        res.send("Hello World");
    }

    async example(req, res)
    {
        const command = await (new ExampleFactory())
            .hydrateCommand(req.body);
            
        const data = await this.bus.execute(command);
        res.send(data);
    }
}