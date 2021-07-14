import { ExampleCommand } from "../../Boundary/Commands/ExampleCommand";

export class ExampleFactory
{
    async hydrateCommand(body:object): Promise<ExampleCommand>
    {
        return new ExampleCommand("HELLO WORLD");
    }
}