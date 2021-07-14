const path = require("path");
const fs = require('fs');
const args = process.argv.slice(2);

const name = args[0];

const commandTemplate = `export class ${name}
{
    constructor()
    {

    }
}
`;

const handlerTemplate = `import { CommandHandler } from "./CommandHandler";
import { ${name} } from "../Commands/${name}";

export class ${name}Handler implements CommandHandler
{
    async handle(command:${name})
    {

    }
}
`;

(async () => {
    fs.writeFile(path.join(__dirname, `../server/Boundary/Commands/${name}.ts`), commandTemplate, (err) => {
        if (err) throw err;
    });
    fs.writeFile(path.join(__dirname, `../server/Boundary/CommandHandlers/${name}Handler.ts`), handlerTemplate, (err) => {
        if (err) throw err;
    });
    console.log(`${name} Command and Handler created`);
})();