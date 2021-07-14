import { ExecutionBus } from '../Services/ExecutionBus';
import { ExampleController } from './ExampleController';

const exampleController = new ExampleController(new ExecutionBus());

export {
    exampleController
};