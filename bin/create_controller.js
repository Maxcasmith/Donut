const path = require("path");
const fs = require('fs');
const args = process.argv.slice(2);

const name = args[0];

const controllerTemplate = `import { bus } from "../Services/ExecutionBus";

export class ${name}
{
    constructor() 
    {

    }
}
`;

(async () => {
    fs.writeFile(path.join(__dirname, `../server/Application/Controllers/${name}.ts`), controllerTemplate, (err) => {
        if (err) throw err;
    });
    console.log(`${name} created`);
})();