const mongoose = require("mongoose");
const bcrypt= require("bcrypt")


const productManagerSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      default:"manager1234"
    },
    phone:{
      type: Number,
      unique: true,
    },
    access: {
      type: Boolean,
        default: true,
    }
  });

  const productManagerCollection=mongoose.model('ProductManagerDetails',productManagerSchema)
  module.exports=productManagerCollection;
 




  

  