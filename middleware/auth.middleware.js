const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const checkUser = (req, res, next) => {
    const token = req.signedCookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.user = null;
                next();
            } else {
                let user = await UserModel.findById(decodedToken.id).select("-password");
                res.locals.user = user.id;
                next();
            }
        });
    } else {
        res.locals.user = null;
        next();
    }
};
const requireAuth = (req, res, next) => {
    const token = req.signedCookies.jwt;
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.cookie('jwt', '', { httpOnly: true, sameSite: 'Lax', signed: true, maxAge: 1 });
                console.log(err);
                res.send(200).json('no token')
            } else {
                next();
            }
        });
    } else {
        console.log('No token auth middleware');
    }
};

module.exports = {
    checkUser,
    requireAuth,
}