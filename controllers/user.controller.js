const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;


const getAllUsers = async (req, res) => {
    const users = await UserModel.find().select("-password");
    res.send(users);
};

const lullaby = (req, res) => {
    console.info(`running port ${process.env.APP_PORT}`);
    res.status(200).send(`running port ${process.env.APP_PORT}`);
};

module.exports = {
    getAllUsers,
    lullaby,
}