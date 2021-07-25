import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';

const app = express();
const jsonParser = bodyParser.json();

app.use(cors());
app.use(express.static('../client'));

require('./Application/routing.js')(app, jsonParser);

app.listen(8000);
