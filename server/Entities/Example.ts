import { Entity } from "./Entity";

export class Example extends Entity
{
    private value: string;

    constructor(data: object)
    {
        super('example');
        this.value = data['value'];
    }

    getValue(): string
    {
        return this.value;
    }
}