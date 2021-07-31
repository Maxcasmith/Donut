const path = require("path");
const fs = require('fs');
const args = process.argv.slice(2);

const name = args[0];
const dir = args[1];

const commandTemplate = `export class ${name}Command
{
    constructor()
    {

    }
}
`;

const handlerTemplate = `import { CommandHandler } from "../CommandHandler";
import { ${name}Command } from "../../Commands/${dir}/${name}Command";

export class ${name}CommandHandler implements CommandHandler
{
    async handle(command:${name}Command): Promise<any>
    {

    }
}
`;

function toCammelCase(text)
{
    const result = text.replace( /([A-Z])/g, " $1" );
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
}

(async () => {
    if (args.length == 0) {
        const file = JSON.parse(fs.readFileSync(path.join(__dirname, `../maps/commandMap.json`), 'utf8'))[0];
        const fileName = file['name'];
        const fileDir = file['dir'];
        const params = file['params'];

        if (!fs.existsSync(`./server/Boundary/Commands/${fileDir}`)) fs.mkdirSync(`./server/Boundary/Commands/${fileDir}`);
        if (!fs.existsSync(`./server/Boundary/CommandHandlers/${fileDir}`)) fs.mkdirSync(`./server/Boundary/CommandHandlers/${fileDir}`);

        let writer;

        writer = fs.createWriteStream(path.join(__dirname, `../server/Boundary/Commands/${fileDir}/${fileName}Command.ts`), {
            flags: 'a'
        });
        writer.write(`export class ${fileName}Command
{
    `);

        for (let paramName in params) {
            writer.write(`private ${paramName}:${params[paramName]};
    `);
        }

        writer.write(`
    constructor(`);

        let i = 0;
        let objectLength = Object.keys(params).length - 1;
        for (let paramName in params) {
            writer.write(`${paramName}:${params[paramName]}`);
            if (i != objectLength) writer.write(', ');
            i++;
        }

        writer.write(`)
    {
        `);
        
        i = 0;
        for (let paramName in params) {
            writer.write(`this.${paramName} = ${paramName};`);
            if (i != objectLength) writer.write(`
        `);
            i++;
        }

        writer.write(`
    }

`);

        for (let paramName in params) {
            writer.write(`    get${toCammelCase(paramName)}(): ${params[paramName]} 
    {
        return this.${paramName};
    }

    set${toCammelCase(paramName)}(${paramName}:${params[paramName]}): this 
    {
        this.${paramName} = ${paramName};
        return this;
    }

`);
        }

        writer.write(`}
`);

        writer.end();

        fs.writeFile(path.join(__dirname, `../server/Boundary/CommandHandlers/${fileDir}/${fileName}CommandHandler.ts`), `import { CommandHandler } from "../CommandHandler";
import { ${fileName}Command } from "../../Commands/${fileDir}/${fileName}Command";

export class ${fileName}CommandHandler implements CommandHandler
{
    async handle(command:${fileName}Command): Promise<any>
    {
        
    }
}
`, (err) => {
            if (err) throw err;
        });

        console.log(`${fileName} Command and Handler created`);
    }
    else if (args.length == 2 && name != undefined && dir != undefined) {

        if (!fs.existsSync(`./server/Boundary/Commands/${dir}`)) fs.mkdirSync(`./server/Boundary/Commands/${dir}`);
        if (!fs.existsSync(`./server/Boundary/CommandHandlers/${dir}`)) fs.mkdirSync(`./server/Boundary/CommandHandlers/${dir}`);

        fs.writeFile(path.join(__dirname, `../server/Boundary/Commands/${dir}/${name}Command.ts`), commandTemplate, (err) => {
            if (err) throw err;
        });
        fs.writeFile(path.join(__dirname, `../server/Boundary/CommandHandlers/${dir}/${name}CommandHandler.ts`), handlerTemplate, (err) => {
            if (err) throw err;
        });
        console.log(`${name} Command and Handler created`);

    } 
    else console.log("Please use this format when creating a command 'npm run create_command {dir|example:User} {commandName|example:Login}' or 'npm run create_command {path_to_command_map}'");
})();