export class ValidationRule 
{
    private validationFunc:Function;
    private message:string;

    constructor (validationFunc:Function, message:string) {
        this.validationFunc = validationFunc;
        this.message = message;
    }

    getValidationFunc(): Function
    {
        return this.validationFunc;
    }

    getMessage(): string
    {
        return this.message;
    }
}