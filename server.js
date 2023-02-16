const express = require('express');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const { checkUser, requireAuth } = require('./middleware/auth.middleware');
// require('dotenv').config({path: './config/.env'});
require('dotenv').config();
require('./config/database');
const app = express();


const corsOptions = {
    origin: true,
    credentials: true,
    'Access-Control-Allow-Origin': process.env.CLIENT_URL,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'allowedHeaders': ['Authorization', 'Content-Type', 'sessionId'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}
app.use(cors(corsOptions));
// app.use(cors (process.env.CLIENT_URL));
// app.use(cors('http://localhost:3000/'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// jwt
// app.get('/', checkUser);
// app.get('/login', checkUser);
app.get('/login', checkUser);
app.get('/logout', checkUser);
app.get('/users', checkUser);
app.get('/register', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    let token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            token=decodedToken.id;
        })
    res.status(200).send(token);
    // res.status(200).send(token)
    // console.log('jwti.............',token);
    // console.log(req.cookies.jwt);
    console.log('jeton trouvé');
    }
});


// routes
app.use('/api', userRoutes);


// server
app.listen(process.env.APP_PORT, () => {
    console.log(`Listening on port ${process.env.APP_PORT}`);
})
