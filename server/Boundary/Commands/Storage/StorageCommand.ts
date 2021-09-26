import { Command } from "../Command";


export class StorageCommand extends Command
{
    private file: any;
    private disk: string;
    private filename: string|null;

    constructor(file:any, disk:string = 'local', filename:string|null = null)
    {
        super("Storage");
        this.file = file;
        this.disk = disk;
        this.filename = filename || file.name;
    }

    getFile(): any 
    {
        return this.file;
    }

    setFile(file:File): this 
    {
        this.file = file;
        return this;
    }

    getDisk(): string 
    {
        return this.disk;
    }

    setDisk(disk:string): this 
    {
        this.disk = disk;
        return this;
    }

    getFilename(): string
    {
        return this.filename;
    }

    setFilename(filename:string): this
    {
        this.filename = filename;
        return this;
    }

    
}
