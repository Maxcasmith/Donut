const test = require('../build/tests/ExampleTest.js');
const tester = new test['ExampleTest']();

tester.test_exampleController_returns_correct_data();