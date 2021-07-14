import { rules } from "../../configs/ValidationRules";

export class ValidatorService 
{
    static validate(field:any, validationString:string): Promise<boolean>
    {
        return new Promise(async (resolve) => {
            const validationLoader = validationString.split("|");
            for (let validationRule of validationLoader) {
                let response = true;
                if (validationRule.includes(":"))  {
                    const value = validationRule.split(":")[1];
                    validationRule = validationRule.split(":")[0];
                    response = rules[validationRule].getValidationFunc()(field, value);
                }
                else response = rules[validationRule].getValidationFunc()(field);
                if (response != true) throw new Error(rules[validationRule].getMessage());
            }
            resolve(true);
        });
    }
}