export class ValidationRule 
{
    constructor (validationFunc, message) {
        this.validationFunc = validationFunc;
        this.message = message;
    }

    getValidationFunc()
    {
        return this.validationFunc;
    }

    getMessage()
    {
        return this.message;
    }
}