const UsersModel = require("../models/User");
const BadRequestError = require("../errors/bad-request");
const UnauthenticatedError = require("../errors/unauthenticated")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const register = async (req,res) => {
    const {email, password, name} = req.body;
    // const salt = bcrypt.genSaltSync(10);
    // const hashed = bcrypt.hashSync(password, salt);

    const user = await UsersModel.create({name, email, password})
    const token = jwt.sign({userId: user._id, userName: user.name}, process.env.TOKEN_SECRET, {expiresIn: "30d"})
    res.status(201).json(token)
}
const login = async (req,res) => {
    const {email, password: newPassword} = req.body;
    if(!email || !newPassword){
        throw new BadRequestError("please input an email or password!")
    }
    const oneUser = await UsersModel.findOne({email})
    if(!oneUser){
        throw new UnauthenticatedError("invalid email or password")
    }
    
    const isMatch = await bcrypt.compare(newPassword, oneUser.password)
    if (!isMatch) throw new UnauthenticatedError("invalid email or password")

    const token = jwt.sign({userId: oneUser._id, userName: oneUser.name}, process.env.TOKEN_SECRET, {expiresIn: "30d"})
    res.status(200).json({user:{name : oneUser.name}, token})
}

module.exports = {
    register,
    login
}