const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

module.exports.checkUser = (req, res, next) => {
    const token = req.signedCookies.jwt;
    // const token = req.cookies.jwt;
    console.log('checkUser before if', token);
    if (token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                
                res.locals.user = null;
                // res.cookie("jwt", "", { maxAge: 1 });
                console.log("checkUser err sur token");
                next();
            } else {
                console.log("checkUser ok");
                let user = await UserModel.findById(decodedToken.id).select("-password");
                res.locals.user = user.id;
                console.log(res.locals.user);
                next();
            }
        });
    } else {
        console.log("checkUser no token");
        res.locals.user = null;
        next();
    }
};

module.exports.requireAuth = (req, res, next) => {
    const token = req.signedCookies.jwt;
    // const token = req.cookies.jwt;
    if (token) {
        console.log(token);
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.send(200).json('no token')
            } else {
                console.log(decodedToken.id);
                console.log('token auth middleware');
                next();
            }
        });
    } else {
        console.log('No token auth middleware');
        // res.redirect('/api');
    }
};