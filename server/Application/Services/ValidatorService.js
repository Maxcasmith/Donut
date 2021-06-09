import { rules } from "../../configs/ValidationRules.js";

export class ValidatorService 
{
    static validate(field, validationString)
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
                if (response != true) handle(new Error(rules[validationRule].getMessage()));
            }
            resolve(true);
        });
    }
}

// This is an example of how you would use the validator
// ValidatorService.validate("example@test.com", "max:3|min:2|email")
//     .then(res => console.log(res));