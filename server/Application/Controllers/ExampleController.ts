import { ExampleCommand } from "../../Boundary/Commands/Example/ExampleCommand";
import { bus } from "../Services/ExecutionBus";
export class ExampleController
{
    async hello(req:any): Promise<any>
    {
        const message = "HELLO WORLD";
        
        const commands = new ExampleCommand(message);
        const data = await bus.execute({ commands, data: { message }, lanes: 'test' });
        return data;
    }
}