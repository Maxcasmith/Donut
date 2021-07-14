import { ValidationRule } from "../Entities/ValidationRule";

export const rules: object = {
    "max" : new ValidationRule(max, "Length exceeds maximum allowed characters"), 
    "min" : new ValidationRule(min, "Length does not enter minimum allowed characters"),
    "email" : new ValidationRule(email, "Field is not a valid email")
}

function max(field:string, value:number): boolean
{
    return field.length <= value;
}

function min(field:string, value:number): boolean
{
    return field.length >= value;
}

function email(field:string): boolean
{
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return (field.match(regexEmail)) ? true : false;
}