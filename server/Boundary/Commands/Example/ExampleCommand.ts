export class ExampleCommand
{
    private value:string;
    
    constructor(value:string)
    {
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
