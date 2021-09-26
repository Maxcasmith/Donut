import * as path from "path";
import * as fs from "fs";
import { CommandHandler } from "../CommandHandler";
import { StorageCommand } from "../../Commands/Storage/StorageCommand";
import { Uuid } from "../../../Entities/Uuid";

export class StorageCommandHandler implements CommandHandler
{
    async handle(command:StorageCommand): Promise<any>
    {
        let url = '';

        if (command.getDisk() == "local")
        {
            const dir:string = '../../../../storage';
            
            if (!fs.existsSync(path.join(__dirname, dir)))
                fs.mkdirSync(path.join(__dirname, dir));

            if (command.getFilename() == command.getFile().name) {
                const fileExt:string = command.getFile().name.split('.')[1];
                const filename:string = `${(new Date()).toISOString()}_${(new Uuid()).getId()}.${fileExt}`;
                command.setFilename(filename);
            }

            const uploadPath:string = path.join(__dirname, `${dir}/${command.getFilename()}`);
            await command.getFile().mv(uploadPath);
            
            url = `storage/${command.getFilename()}`;
        }

        return url;
    }
}
