import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const jsonParser = bodyParser.json();

app.use(cors());
app.use(express.static('../client'));

require('./Application/routes.js')(app, jsonParser);

app.listen(8000);
