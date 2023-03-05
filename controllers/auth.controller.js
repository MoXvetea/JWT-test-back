const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errorsHandler');


// let maxAge = 3 * 24 * 60 * 60 * 1000;
let maxAge = 1 * 1 * 2 * 60 * 1000;
//  Tokens creation functions
const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
};

const createAccessToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '10s'
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

// Account connection: auth token, refresh token generation 
const signIn = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await UserModel.login(email, password);
        const token = createToken(user._id);

        const accessToken = createAccessToken(user._id)

        res.cookie('jwt', token, { httpOnly: true, sameSite: 'Lax', signed: true, maxAge });
        res.send({ accessToken })

    } catch (err) {
        const errors = signInErrors(err);
        res.status(200).json({ errors });
    }
}

const refresh = async (req, res) => {
    try {
        const cookies = req.signedCookies;
        if (!cookies?.jwt) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const refreshToken = cookies.jwt;
        const decodedToken = jwt.verify(refreshToken, process.env.TOKEN_SECRET);
        
        const user = await UserModel.findById(decodedToken.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const accessToken = createAccessToken(decodedToken._id);
        res.send({ accessToken })

    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: ' Access forbidden' });

    }
};

// deconnexion from account, auth jwtcookie duration validity passed to 1ms
const logout = (req, res) => {

    res.cookie('jwt', '', { httpOnly: true, sameSite: 'Lax', signed: true, maxAge: 1 });
    res.redirect('/api');
};

module.exports = {
    signUp,
    signIn,
    logout,
    refresh,
}