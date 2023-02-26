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
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = UserModel.findById(decodedToken.id).select("-password");
    res.locals.user = decodedToken.id;
    console.log('authmiddleware...checkuser...try ok valleur userId', res.locals.user);
    next();
    // res.redirect('/users')

  } catch (err) {
    console.log('authmiddleware...checkuser...erreur, pas de token');
    return res.status(401).json({ message: 'Unrecognized access token' });
  }
}

const requireAuth = (req, res, next) => {
  const token = req.signedCookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      const user = decodedToken

      if (err) {
        res.cookie('jwt', '', { httpOnly: true, sameSite: 'Lax', signed: true, maxAge: 1 });
        return res.status(406).json({ message: 'Unauthorized' });
      } else {
        next();
      }
    });
  } else {
    return res.status(406).json({ message: 'Unauthorized' });
  }
};

module.exports = {
  checkUser,
  requireAuth,
}



    // router.get('/protected', verifyToken, (req, res) => {
      //     // access token is valid, do something here
      //     res.json({ message: 'You have access to this protected resource' });
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
    //   });