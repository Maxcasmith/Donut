import { Command } from "../Command";

export class ExampleCommand extends Command
{
    private value:string;
    
    constructor(value:string)
    {
        super('Example');
        this.value = value;
    }

    getValue(): string 
    {
        return this.value;
    }

    setValue(value:string): this 
    {
        this.value = value;
        return this;
    }

}
