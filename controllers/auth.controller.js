const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errors.utils');


// milliseconds
let maxAge = 3 * 24 * 60 * 60 * 1000;
// // Token creation function
const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
};

// Account creation
module.exports.signUp = async (req, res) => {
    const { pseudo, email, password } = req.body
    try {
        const user = await UserModel.create({ pseudo, email, password });
        res.status(201).json({ user: user._id });
    }
    catch (err) {
        const errors = signUpErrors(err);
        res.status(200).send({ errors })
    }
}

// Account connection, auth token generation
module.exports.signIn = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await UserModel.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, sameSite:'Lax', signed: true, maxAge});
        // res.cookie('jwt', token, { httpOnly: true, signed: true, maxAge });
        // res.end('cookie set');
        res.status(200).json({ user: user._id })
        // console.log(user._id, 'authcontroller signin  ....', token);
    } catch (err) {
        console.log("signIn.....................errrrrrrrrrrrrrrrorrrrrrrrrrrrrrrrrr...");
        const errors = signInErrors(err);
        res.status(200).json({ errors });
    }
}


// deconnexion from account, auth token duration validity passed to 1ms
module.exports.logout = (req, res) => {
    // const cooki =  req.signedCookies.jwt;
    // res.clearCookie('jwt'," ",{ httpOnly: true, signed:true});
    // console.log('logout........................',cooki);
    console.log(req.signedCookies);
    
    res.cookie('jwt', '', { httpOnly: true, sameSite:'Lax',  signed: true, maxAge:1 });
    // res.set('Set-Cookie', 'jwt=;expires=Thu, 01 Jan 1970 00:00:00 GMT;HttpOnly');
    console.log('.................................................logout');
    res.redirect('/api');
  };



//     res.cookie('jwt', " ", { httpOnly: true, signed: true, maxAge: 1 });
//     console.log('logout après del normalement....');
//     res.redirect('/api');
// }
