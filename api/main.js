
console.clear();

require('dotenv').config();
require('./env');

const express = require('express');
const { init: initDB } = require('./db');
const { init: initAuth } = require('./auth');
const institutions = require('./institutions');
const clerks = require('./clerks');
const resource_types = require('./resource_types');
const resources = require('./resources');
const bookings = require('./bookings');
const morgan = require('morgan');


const app = express();

// middlewares
if (process.env.NODE_ENV !== 'test')
   app.use(morgan('dev'));

app.use(express.static(`${__dirname}/static`));

app.use(express.json());
initAuth(app);

// routes
app.use('/api/institutions', institutions);
app.use('/api/clerks', clerks);
app.use('/api/resource-types', resource_types);
app.use('/api/resources', resources);
app.use('/api/bookings', bookings);

app.get('*', (req, res) => {
   const indexFile = `${__dirname}/static/index.html`;
   res.sendFile(indexFile);
});


// initialization
const PORT = process.env.PORT;

initDB().then(() => {
   app.listen(PORT, async () => {
      console.log("Server started @ PORT", PORT);   
   });
});