const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errorsHandler');


// let maxAge = 3 * 24 * 60 * 60 * 1000;
let maxAge = 1 * 1 * 20 * 60 * 1000;
// // Token creation function
const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, {
        expiresIn: maxAge
    })
};
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const createAccessToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '10s'
    })


};
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
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

        const accessToken = createAccessToken(user._id)
        // accessToken = accessToken.json({accessToken: accessToken})

        res.cookie('jwt', token, { httpOnly: true, sameSite: 'Lax', signed: true, maxAge });
        // res.status(200).json({ user: user._id })


        res.send({ accessToken })
        // 
        console.log('authController...signIn...accessToken', accessToken);
        res.set('Authorization', `Bearer ${accessToken}`).send();
        // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    } catch (err) {
        const errors = signInErrors(err);
        // res.status(200).json({ errors });
    }
}


// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const refresh = async (req, res) => {
    try {
        const cookies = req.signedCookies;
        if (!cookies?.jwt) {
            console.log('into refresh...user........RERROR.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const refreshToken = cookies.jwt;
        const decodedToken = jwt.verify(refreshToken, process.env.TOKEN_SECRET);

        // const foundUser = await User.findOne({ username: decodedToken.username }).exec();
        const user = await UserModel.findById(decodedToken.id).select("-password");
        if (!user) {
            console.log('into refresh...user........RERROR.!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const accessToken = createAccessToken(decodedToken._id);
        console.log('into refresh...accessToken.........', accessToken);
        res.send({ accessToken })
        // res.json({ accessToken });
        // res.set('Authorization', `Bearer ${accessToken}`).send();

    } catch (err) {
        console.error(err);
        // res.cookie('jwt', '', { httpOnly: true, sameSite: 'Lax', signed: true, maxAge: 1 });
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