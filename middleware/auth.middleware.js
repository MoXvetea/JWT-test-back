const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");


const checkUser = (req, res, next) => {

  // get the access token from the header
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({ message: 'Missing access token' });
  }
  try {
    // verify the access token with the secret key
    let decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = UserModel.findById(decodedToken.id).select("-password");
    res.locals.user = decodedToken.id;
    console.log('authmiddleware...checkuser...try ok valleur userId', res.locals.user);
    next();
    // res.redirect('/users')

  } catch (err) {
    console.log('erroe');
    return res.status(401).json({ message: 'Invalid access token' });
  }
}
// const checkUser = (req, res, next) => {
//     const token = req.signedCookies.jwt;
//     if (token) {
//         jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
//             if (err) {
//                 res.locals.user = null;
//                 next();
//             } else {
//                 let user = await UserModel.findById(decodedToken.id).select("-password");
//                 res.locals.user = user.id;
// console.log('authmiddleware...checkuser...try ok valleur userId', res.locals.user);
//                 next();
//             }
//         });
//     } else {
//         res.locals.user = null;
//         next();
//     }
// };

const requireAuth = (req, res, next) => {
  const token = req.signedCookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      const user = decodedToken
      // console.log( 'authmiddleware...requireauth..tokenverify ok',user);
      if (err) {
        res.cookie('jwt', '', { httpOnly: true, sameSite: 'Lax', signed: true, maxAge: 1 });
        // res.send(406).json('no token')
        return res.status(406).json({ message: 'Unauthorized' });
      } else {
        // // Correct token we send a new access token
        // const accessToken = jwt.sign({
        //    user
        // }, process.env.ACCESS_TOKEN_SECRET, {
        //     expiresIn: '5m'
        // });
        // return res.json({ accessToken });
        next();
      }
    });
  } else {
    console.log('authmiddleware...requireauth...no token');
    // return res.status(406).json({ message: 'Unauthorized' });
    // console.error(err);
    // console.log('No token auth middleware');
  }
};

module.exports = {
  checkUser,
  requireAuth,
}



    // router.get('/protected', verifyToken, (req, res) => {
    //     // access token is valid, do something here
    //     res.json({ message: 'You have access to this protected resource' });
    //   });