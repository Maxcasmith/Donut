import { Query } from "../server/Entities/Query.js";
import { migrations } from "../server/Migrations";

(async () => 
{
    for (let m = (migrations.length - 1); m >= 0; m--) {

        const results = await (new Query(`SELECT * FROM migrations WHERE migration_name = "${migrations[m].name}"`)).execRawQueryString();
        const willRollback = (results.length > 0) || false;

        if (willRollback) {
            console.log("\x1b[33m", `rolling back ${migrations[m].name}`);
            migrations[m].down();
            console.log("\x1b[32m", `rolled back ${migrations[m].name}`);
        }
    }
})();