//express server
const express = require('express');
const app = express();
const port = 1377;

//custom modules
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

//app listen
app.listen(port, () => console.log(`phackbot API is currently running on port ${port}...`));

//pages
const replaApi = require('./routes/repla');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1/', replaApi);
