const {MySQLQuery} = require("../database/MySQLQuery.js");
const {migrations} = require("../database/Migrations");

(async () => 
{
    for (let m = (migrations.length - 1); m >= 0; m--) {

        const results = await (new MySQLQuery(`SELECT * FROM migrations WHERE migration_name = "${migrations[m].name}"`)).execRawQueryString();
        const willRollback = (results.length > 0) || false;

        if (willRollback) {
            console.log("\x1b[33m", `rolling back ${migrations[m].name}`);
            const data = await migrations[m].down();
            if (data['errno']) throw Error(data['message']);
            console.log("\x1b[32m", `rolled back ${migrations[m].name}`);
        }
    }
})();