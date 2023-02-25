const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");
const checkUser = require("../middleware/auth.middleware")


// auth
router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

// user DB
router.get("/", userController.lullaby);
// router.get("/users",userController.getAllUsers);
// router.get("/users/user", checkUser, userController.getAllUsers);

module.exports = router;

    // router.get('/protected', verifyToken, (req, res) => {
    //     // access token is valid, do something here
    //     res.json({ message: 'You have access to this protected resource' });
    //   });