const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, "Please provide company name"],
            maxlength: 50,
        },
        position: {
            type: String,
            requred: [true, "please provide a position"],
            maxlength: 100
        },
        status: {
            type: String,
            enum: ["interview", "decline", "pending"],
            default: "pending" 
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, "please provide user"]
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Jobs", JobSchema)