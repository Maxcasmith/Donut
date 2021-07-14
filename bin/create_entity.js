const path = require("path");
const fs = require('fs');
const args = process.argv.slice(2);

const name = args[0];

const controllerTemplate = `import { Entity } from "./Entity";

export class ${name} extends Entity
{
    constructor(data: object)
    {
        super('${name.toLowerCase()}');
    }
}
`;

(async () => {
    fs.writeFile(path.join(__dirname, `../server/Entities/${name}.ts`), controllerTemplate, (err) => {
        if (err) throw err;
    });
    console.log(`${name} Entity created`);
})();