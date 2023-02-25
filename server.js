require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const UserModel = require("./models/user.model");
const userRoutes = require('./routes/user.routes');
const { checkUser, requireAuth } = require('./middleware/auth.middleware');
const userController = require("./controllers/user.controller");
require('./config/database');
const app = express();


const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'Access-Control-Allow-Origin': process.env.CLIENT_URL,
    'allowedHeaders': ['Authorization', 'Content-Type', 'sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}
app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));

// app.get('*', checkUser);
// app.get('/api/users', checkUser);

// app.get('/api/users', checkUser, (req, res) => {
//     console.log(res.locals.user);
//     res.status(200).send(res.locals.user)
// res.redirect('/api/users')
// });


// app.get('/users', checkUser, (req, res) => {
//     // res.status(200).send(res.locals.user)
//     res.status(200)
//     });

    app.get('/users', checkUser, userController.getAllUsers);

// app.get('/yui/users', checkUser, async(req, res) => {
   
//         console.log('ok get');
//         const users = await UserModel.find().select("-password");

//         // Send the users as the response
//         res.status(200).send(users);
//     }

//     );

app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user)
});


// routes
app.use('/api', userRoutes);


// server
app.listen(process.env.APP_PORT, () => {
    console.log(`Listening on port ${process.env.APP_PORT}`);
})
