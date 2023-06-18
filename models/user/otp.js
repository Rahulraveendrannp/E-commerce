const mongoose=require("mongoose");

const otpSchema=new mongoose.Schema({

    email: {
        type: String,
      },
    otp:{
        type:Number,
        unique: true,
    },
    expireAt:{
        type:Date,
        default:Date.now,
        expires:60
    },
},{
    timestamps:true
})


const otpCollection=mongoose.model("Otp",otpSchema);
module.exports=otpCollection 