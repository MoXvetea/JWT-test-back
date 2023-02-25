const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;


const getAllUsers = async (req, res) => {
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    // const authHeader = req.headers['authorization'];
    // const accessToken = authHeader && authHeader.split(' ')[1];
    // if (!accessToken) {
    //   return res.status(401).json({ message: 'Missing access token' });
    // }
    
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    console.log('getaalluser');
    const users = await UserModel.find().select("-password");
    res.send(users);
};

const lullaby = (req, res) => {
    console.log(`running port ${process.env.APP_PORT}`);
    res.status(200).send(`running port ${process.env.APP_PORT}`);
};

module.exports = {
    getAllUsers,
    lullaby,
}