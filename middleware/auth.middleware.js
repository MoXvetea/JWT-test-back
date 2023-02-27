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
    next();

  } catch (err) {
    return res.status(401).json({ message: 'Unrecognized access token' });
  }
}

const requireAuth = (req, res, next) => {
  const token = req.signedCookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      // const user = decodedToken
      res.locals.user = decodedToken.id;
      if (err) {
        res.cookie('jwt', '', { httpOnly: true, sameSite: 'Lax', signed: true, maxAge: 1 });
        return res.status(401).json({ message: 'Unauthorized' });
      } else {
        next();
      }
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = {
  checkUser,
  requireAuth,
}
