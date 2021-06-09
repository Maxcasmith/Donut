import { ValidationRule } from "../Entities/ValidationRule.js";

export const rules = {
    "max" : new ValidationRule(max, "Length exceeds maximum allowed characters"), 
    "min" : new ValidationRule(min, "Length does not enter minimum allowed characters"),
    "email" : new ValidationRule(email, "Field is not a valid email")
}

function max(field, value)
{
    return field.length <= value;
}

function min(field, value)
{
    return field.length >= value;
}

function email(field)
{
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return (field.match(regexEmail)) ? true : false;
}