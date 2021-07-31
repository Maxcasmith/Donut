import { ExampleCommand } from "../../Boundary/Commands/Example/ExampleCommand";

export class ExampleFactory
{
    async hydrateCommand(body:object): Promise<ExampleCommand>
    {
        return new ExampleCommand("HELLO WORLD");
    }
}