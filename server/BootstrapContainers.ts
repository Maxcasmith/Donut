import { ValidatorService } from "./Application/Services/ValidatorService";
import { rules } from "./configs/ValidationRules";

new ValidatorService(rules);