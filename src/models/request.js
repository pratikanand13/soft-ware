const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
    {
        createdBy:{
            type: mongoose.Schema.Types.ObjectId
        },
        name:{
            type:String
        },
        completed:{
            type:Boolean,
            default:false
        },
        location:{
            type:String
        },
        needed:{
            type:String
        },
        bType:{
            type:String,
            default:'none'
        },
        quantity:{
            type:String
        },
        description:{
            type:String
        },
        title: {
            type:String
        },
        collectedAmount:{
            type:Number,
            default:0
        },
        driveLink:{
            type:String
        }
    },
    {
        timestamps:true
    }
)

const Request = mongoose.model("Request", requestSchema);

module.exports = Request;