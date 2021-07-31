import { CommandHandler } from "../CommandHandler";
import { ExampleCommand } from "../../Commands/Example/ExampleCommand";
import { Example } from "../../../Entities/Example";

export class ExampleCommandHandler implements CommandHandler
{
    async handle(command:ExampleCommand): Promise<any>
    {
        const exampleEntity = new Example({
            value: command.getValue()
        });

        return exampleEntity;
    }
}
