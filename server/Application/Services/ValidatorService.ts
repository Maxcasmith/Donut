export class ValidatorService 
{
    static rules:object;

    constructor(rules:object)
    {
        ValidatorService.rules = rules;
        Object.freeze(ValidatorService.rules);
    }

    static async validate(field:any, validationString:string): Promise<boolean>
    {
        const validationLoader = validationString.split("|");
        for (let validationRule of validationLoader) {
            let response = true;
            if (validationRule.includes(":"))  {
                const value = validationRule.split(":")[1];
                validationRule = validationRule.split(":")[0];
                response = ValidatorService.rules[validationRule].getValidationFunc()(field, value);
            }
            else response = ValidatorService.rules[validationRule].getValidationFunc()(field);
            if (response != true) throw Error(`For value ${field} : ` + ValidatorService.rules[validationRule].getMessage());
        }
        return true;
    }
}