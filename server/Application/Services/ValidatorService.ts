export class ValidatorService
{
    static validator:any;

    constructor(validator:any) 
    {
        ValidatorService.validator = validator;
        Object.freeze(this);
    }
}

export async function validate(data:any, pattern:string, options:object|null = {})
{
    return await ValidatorService.validator.validate(data, pattern, options);
}
