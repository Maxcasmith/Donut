const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const { Controller, Command, CommandHandler } = require('./Writable.js');

const crudMap = yaml.load(fs.readFileSync(path.join(__dirname, '../crud-map.yaml')));
const map = yaml.load(fs.readFileSync(path.join(__dirname, '../map.yaml')));

(async () => {
    const crudSetup = crudMap['entities'];
    const entitiesData = map['entities'];
    
    for (let e of crudSetup) {
        const entity = entitiesData[e];

        const createValues = entity.values.filter(x => x.split(":")[0] != `${e.toLowerCase()}_id`);
        const listCommand = new Command(`List${e}Command`, `../server/Boundary/Commands/${e}/List${e}Command.ts`, e, ['limit:number', 'offset:number']);
        const createCommand = new Command(`Create${e}Command`, `../server/Boundary/Commands/${e}/Create${e}Command.ts`, e, createValues);
        const readCommand = new Command(`Read${e}Command`, `../server/Boundary/Commands/${e}/Read${e}Command.ts`, e, ['id:number']);
        const updateCommand = new Command(`Update${e}Command`, `../server/Boundary/Commands/${e}/Update${e}Command.ts`, e, entity.values);
        const deleteCommand = new Command(`Delete${e}Command`, `../server/Boundary/Commands/${e}/Delete${e}Command.ts`, e, ['id:number']);

        const listCommandHandler = new CommandHandler(`List${e}CommandHandler`, `../server/Boundary/CommandHandlers/${e}/List${e}CommandHandler.ts`, {
            name: `List${e}Command`,
            path: `../../Commands/${e}/List${e}Command`
        }, `const q = new Query();\n        q.table('${e.toLowerCase()}');\n        return await q.limit(command.getLimit())\n            .offset(command.getOffset())\n            .get();`);

        listCommandHandler.addImport('Query', '../../../Entities/Query/Query');

        const attributes = (createCommand.functions.filter(f => f.name.includes("get"))).map(f => f.name);

        let itemsTemplate = "";
        for (let a of attributes.filter(x => x != `get${e}Id`)) {
            itemsTemplate += listCommand.inCamel(a.replace("get", "")) + `: command.${a}(),\n            `;
        }
        if (itemsTemplate != "") itemsTemplate = itemsTemplate.slice(0, -14);

        const createCommandHandler = new CommandHandler(`Create${e}CommandHandler`, `../server/Boundary/CommandHandlers/${e}/Create${e}CommandHandler.ts`, {
            name: `Create${e}Command`,
            path: `../../Commands/${e}/Create${e}Command`
        }, `const data = new ${e}({
            ${itemsTemplate}
        });\n        return await data.create();`);

        createCommandHandler.addImport(e, `../../../Entities/${e}`);

        const readCommandHandler = new CommandHandler(`Read${e}CommandHandler`, `../server/Boundary/CommandHandlers/${e}/Read${e}CommandHandler.ts`, {
            name: `Read${e}Command`,
            path: `../../Commands/${e}/Read${e}Command`
        }, `return await ${e}.find(command.getId())`);

        readCommandHandler.addImport(e, `../../../Entities/${e}`);

        let updateId = null;
        let updates = "";
        for (let d of (updateCommand.functions.filter(f => f.name.includes("get"))).map(f => f.name)) {
            if (updateId == null && d.includes('Id')) updateId = d;
            d = (d.replace("get", ""));
            updates += `if (command.get${d}()) data.set${d}(command.get${d}());\n        `;
        }
        if (updates != "") updates = updates.slice(0, -8);

        const updateCommandHandler = new CommandHandler(`Update${e}CommandHandler`, `../server/Boundary/CommandHandlers/${e}/Update${e}CommandHandler.ts`, {
            name: `Update${e}Command`,
            path: `../../Commands/${e}/Update${e}Command`
        }, `const data = await ${e}.find(command.${updateId}());\n        ${updates}\n        return await data.update();`);

        updateCommandHandler.addImport(e, `../../../Entities/${e}`);

        const deleteCommandHandler = new CommandHandler(`Delete${e}CommandHandler`, `../server/Boundary/CommandHandlers/${e}/Delete${e}CommandHandler.ts`, {
            name: `Delete${e}Command`,
            path: `../../Commands/${e}/Delete${e}Command`
        }, `const data = await ${e}.find(command.getId());\n        await data.delete();\n        return { SUCCESS: true, MESSAGE: "${e} successfully deleted"}`);

        deleteCommandHandler.addImport(e, `../../../Entities/${e}`);

        const createParamString = (prev, current) => `${prev.split(":")[0]}, ${current.split(":")[0]}`;

        const params = (entity.values.length > 1) ? entity.values.reduce(createParamString) : entity.values[0].split(":")[0];

        let createParams = entity.values.filter(v => v.split(":")[0] != `${e.toLowerCase()}_id`);
        createParams = (createParams.length > 1) ? createParams.reduce(createParamString) : createParams[0].split(":")[0];

        const controller = new Controller(e + "Controller", `../server/Application/Controllers/${e}Controller.ts`, [
            {name: "list", body: `const {limit, offset} = req.query;\n        const commands = new List${e}Command(limit, offset);\n        const data = await bus.execute({ commands });\n        return data;`},
            {name: "create", body: `const { ${createParams} } = req.body;\n        const commands = new Create${e}Command(${createParams});\n        const data = await bus.execute({ commands });\n        return data;`},
            {name: "read", body: `const { id } = req.params;\n        const commands = new Read${e}Command(id);\n        const data = await bus.execute({ commands });\n        return data;`},
            {name: "update", body: `const { ${params} } = req.body;\n        const commands = new Update${e}Command(${params});\n        const data = await bus.execute({ commands });\n        return data;`},
            {name: "delete", body: `const { id } = req.body;\n        const commands = new Delete${e}Command(id);\n        const data = await bus.execute({ commands });\n        return data;`}
        ]);

        controller.addImport(`List${e}Command`, `../../Boundary/Commands/${e}/List${e}Command`);
        controller.addImport(`Create${e}Command`, `../../Boundary/Commands/${e}/Create${e}Command`);
        controller.addImport(`Read${e}Command`, `../../Boundary/Commands/${e}/Read${e}Command`);
        controller.addImport(`Update${e}Command`, `../../Boundary/Commands/${e}/Update${e}Command`);
        controller.addImport(`Delete${e}Command`, `../../Boundary/Commands/${e}/Delete${e}Command`);

        for (let writable of [
            listCommand, createCommand, readCommand, updateCommand, deleteCommand,
            listCommandHandler, createCommandHandler, readCommandHandler, updateCommandHandler, deleteCommandHandler,
            controller
        ]) {
            if (!await writable.fileExists()) await writable.write();
        }
    }
})();

