import { Example } from "../../Entities/Example";
import { ExampleCommand } from "../Commands/ExampleCommand";
import { CommandHandler } from "./CommandHandler";

export class ExampleCommandHandler implements CommandHandler
{
    async handle(exampleCommand:ExampleCommand): Promise<Example>
    {
        const exampleEntity = new Example({
            value: exampleCommand.getValue()
        });

        return exampleEntity;
    }
}