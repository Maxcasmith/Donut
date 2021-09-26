import { Request } from "../Request";
import { bus } from "../Services/ExecutionBus";
import { ExampleCommand } from "../../Boundary/Commands/Example/ExampleCommand";
export class ExampleController
{
    async hello(req:Request): Promise<any>
    {
        const message = "HELLO WORLD";
        
        const commands = new ExampleCommand(message);
        const data = await bus.execute({ commands, data: { message }, lanes: 'test' });
        return data;
    }
}