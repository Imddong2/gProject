const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const _ = require('lodash');
const {routers} = require('./router');
const Model = require('./models');
const cors = require('cors');

const PORT = 3001;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({exposedHeaders: '*'}));
const corsOptions = {
    origin: 'http://localhost:3001',
    credentials: true, 
  };
  

app.server = http.createServer(app);


// Setup Websocket Server.
app.routers = routers(app);


// Set Models

app.models = new Model(app);



// Start server
app.server.listen(PORT, () => {

    console.log(`Server is running on: http://localhost:${PORT}`);
});
