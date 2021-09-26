export class Uuid
{
    private uuid:string;

    constructor(newUuidCharacterString:string|null = null)
    {
        this.uuid = (newUuidCharacterString != null) ? newUuidCharacterString : this.generate();
    }

    generate(): string
    {
        let dt = new Date().getTime();
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    }

    getId(): string
    {
        return this.uuid;
    }
}