const fs = require('fs');
const path = require('path');

class Writable
{
    constructor(name, path)
    {
        this.name = name;
        this.path = path;
        this.imports = [];
        this.functions = [];
        this.params = [];
    }

    setExtendor(extendor)
    {
        this.extendor = extendor;
        return this;
    }

    setImplementor(implementor)
    {
        this.implementor = implementor;
        return this;
    }

    setTemplate(template)
    {
        this.template = template;
        return this;
    }

    addImport(item, path)
    {
        this.imports.push({item, path});
        return this;
    }

    addFunction(name, body, options)
    {
        const f = { name, body };
        
        if (options) {
            f['async'] = options['async'];
            f['args'] = options['args'];
            f['returns'] = options['returns'];
        }
        this.functions.push(f);
        return this;
    }
    
    addParam(name, type, defaultValue)
    {
        this.params.push({name, type, defaultValue});
        return this;
    }

    replaceBookmark(bookmark, template)
    {
        this.template = this.template.replaceAll(`{{${bookmark}}}`, template);
        return this;
    }

    inCamel(name)
    {
        const camel = name.replace(/([-_][a-z])/ig, (s) => {
            return s.toUpperCase()
                .replace('-', '')
                .replace('_', '');
        });

        return (camel.charAt(0).toLowerCase()) + camel.slice(1);
    }

    capitalizeFirstLetter(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async fileExists()
    {
        return fs.existsSync(path.join(__dirname, this.path));
    }

    async write()
    {
        this.template = `{{Imports}}
export class {{Name}} ${this.extendor ? "extends {{Extender}}" : this.implementor ? "implements {{Implementor}}" : ""}
{
    {{Params}}{{Functions}}
}
`;

        let templateImport = ``;
        for (let i of this.imports) {
            templateImport += `import { ${i.item} } from "${i.path}";\n`;
        }
        this.replaceBookmark('Imports', templateImport);

        this.replaceBookmark('Name', this.name);

        if (this.extendor) this.replaceBookmark('Extender', this.extendor);
        else if (this.implementor) this.replaceBookmark('Implementor', this.implementor);

        let templateParams = "";
        for (let p of this.params) {
            templateParams += `private ${p.name}: ${p.type}${p.defaultValue ? ` = ${p.defaultValue}` : ""};\n    `;
        }
        if (templateParams != "") templateParams += "\n    ";
        this.replaceBookmark('Params', templateParams);

        let templateFunctions = "";
        for (let f of this.functions) {
            let tempArgs = "";
            if (f.args) {
                for (let a of f.args) {
                    tempArgs += `${a}, `;
                }
                tempArgs = tempArgs.slice(0, -2);
            }
            templateFunctions += `${f.async ? "async " : ""}${f.name}(${tempArgs})${f.returns ? `: ${f.returns}` : ""}\n    {\n        ${f.body}\n    }\n\n    `;
        }
        if (templateFunctions != "") templateFunctions = templateFunctions.slice(0, -6);
        this.replaceBookmark("Functions", templateFunctions);
        

        await this.createDirectory();

        fs.writeFile(path.join(__dirname, this.path), this.template, (err) => {
            if (err) throw err;
        });
    }

    async createDirectory()
    {
        const dir = path.dirname(this.path);
        if (!fs.existsSync(path.join(__dirname, dir))) fs.mkdirSync(path.join(__dirname, dir));
    }
}

module.exports.Controller = class Controller extends Writable
{
    constructor(name, path, functions)
    {
        super(name, path);

        this.imports = [
            {item: "Request", path: "../Request"},
            {item: "bus", path: "../Services/ExecutionBus" }
        ];

        for (let f of functions) {
            if (typeof f === "string" || f instanceof String) {
                f = {
                    name: f,
                    body: `const commands = []; // <-- REPLACE ME WITH ONE COMMAND OR AN ARRAY OF COMMANDS\n        const data = await bus.execute({ commands });\n        return data;`
                }
            }

            this.addFunction(f.name, f.body, { args: ["req:Request"], async: true, returns: "Promise<any>" });
        }
    }

}

module.exports.Command = class Command extends Writable
{
    constructor(name, path, dir, parameters = [])
    {
        super(name, path);

        this.imports = [
            {item: "Command", path: "../Command"}
        ];

        let template = `super("${dir}");\n        `;
        for (let p of parameters) {
            const value = this.inCamel(p.split(':')[0]);
            const type = p.split(':')[1];
            
            this.addParam(value, type);

            template += `this.${value} = ${value};\n        `;
        }
        if (template != "") template = template.slice(0, -9);

        this.addFunction('constructor', template, {
            args: parameters.map(p => this.inCamel(p))
        });

        for (let p of parameters) {
            const value = this.inCamel(p.split(":")[0]);
            const type = p.split(":")[1];

            this.addFunction(`get${this.capitalizeFirstLetter(value)}`, `return this.${value};`, { returns: type });
            this.addFunction(`set${this.capitalizeFirstLetter(value)}`, `this.${value} = ${value};\n        return this;`, { args: [`${value}:${type}`], returns: "this"});
        }

        this.setExtendor("Command");
    }
}

module.exports.CommandHandler = class CommandHandler extends Writable
{
    constructor(name, path, command, functionBody = `return "REPLACE ME";`)
    {
        super(name, path);

        this.imports = [
            {item: "CommandHandler", path: "../CommandHandler"},
            {item: command.name, path: command.path}
        ];

        this.setImplementor('CommandHandler');

        this.addFunction('handle', functionBody, { returns: "Promise<any>", args: ["command:"+command.name], async: true });
    }
}

module.exports.Entity = class Entity extends Writable
{
    constructor(name, path, table, parameters = [])
    {
        super(name, path);

        this.imports = [
            {item: "Entity", path: "./Entity"}
        ];

        this.setExtendor("Entity");

        let constructTemplate = `super('${this.capitalizeFirstLetter(table)}');\n        `;
        for (let p of parameters) {
            const value = p.split(":")[0];
            const type = p.split(":")[1];

            this.addParam(this.inCamel(value), type);

            constructTemplate += `this.${this.inCamel(value)} = data['${value}']`;
        }

        this.addFunction("constructor", constructTemplate, { args: ["data:object"] });
        
        for (let p of parameters) {
            const value = this.inCamel(p.split(":")[0]);
            const type = p.split(":")[1];

            this.addFunction(`get${this.capitalizeFirstLetter(value)}`, `return this.${value}`, { returns: type });
            this.addFunction(`set${this.capitalizeFirstLetter(value)}`, `this.${value} = ${value};\n        return this;`, { returns: "this", args: [`${value}:${type}`] });
        }
    }
}

