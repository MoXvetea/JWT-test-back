const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errorsHandler');


// milliseconds
let maxAge = 3 * 24 * 60 * 60 * 1000;
// // Token creation function
const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
};

// Account creation
const signUp = async (req, res) => {
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

// Account connection, auth token generation ici access TOKEN
const signIn = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await UserModel.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, sameSite: 'Lax', signed: true, maxAge });
        res.status(200).json({ user: user._id })
    } catch (err) {
        const errors = signInErrors(err);
        res.status(200).json({ errors });
    }
}


// deconnexion from account, auth jwtcookie duration validity passed to 1ms
const logout = (req, res) => {

    res.cookie('jwt', '', { httpOnly: true, sameSite: 'Lax', signed: true, maxAge: 1 });
    res.redirect('/api');
};

module.exports = {
    signUp,
    signIn,
    logout,
}