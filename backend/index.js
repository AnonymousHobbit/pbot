//express server
const express = require('express');
const app = express();
const port = 1377;

//custom modules
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

//app listen
app.listen(port, () => console.log(`pbot API is currently running on port ${port}...`));

//pages
const replaApi = require('./routes/repla');
const eventApi = require('./routes/events');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/replas', replaApi);
app.use('/events', eventApi);
