import { Validator, DefaultRules } from "donut-validatior";
import { ValidatorService } from "./Application/Services/ValidatorService";
import { rules } from "./configs/ValidationRules";
import { Query } from "./Entities/Query/Query";
import { database } from "./configs/database";

new ValidatorService(new Validator([...DefaultRules, ...rules]));
Query.setComponent(database.queryComponent, database.connection);
