import { ValidatorService } from "./Application/Services/ValidatorService";
import { rules } from "./configs/ValidationRules";
import { Query } from "./Entities/Query/Query";
import { database } from "./configs/database";

new ValidatorService(rules);
Query.setComponent(database.queryComponent, database.connection);