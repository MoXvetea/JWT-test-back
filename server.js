const express = require('express');
const userRoutes = require('./routes/user.routes');
require('dotenv').config({path: './config/.env'});
require('./config/database');
const app = express();
const cors = require('cors');


app.use(cors('*'))
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// routes
app.use('/api/user', userRoutes);


// server
app.listen(process.env.APP_PORT, () => {
  console.log(`Listening on port ${process.env.APP_PORT}`);
})
