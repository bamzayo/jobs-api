const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please provide a name"],
        minlength: 5,
        maxlength: 25
    },
    email: {
        type: String,
        required: [true, "please provide a email"],
        match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide a valid email"
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, "please provide a password"],
        minlength: 5,
        maxlength: 100
    },
})

UserSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // next()
})

module.exports = mongoose.model("User", UserSchema)