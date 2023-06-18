const mongoose = require("mongoose");
const bcrypt= require("bcrypt")


const adminSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
  });

  const adminDetails=mongoose.model('AdminDetails',adminSchema)
  module.exports=adminDetails;
 


  // ------------- Create new admin -----------

// exports.createAdmin=async()=>{
//     const saltRounds =10;
//     const password=process.env.ADMIN_PASSWORD
//     const email=process.env.ADMIN_EMAIL
//     const name=process.env.ADMIN_NAME

//     const hashedPassword= await bcrypt.hash(password,saltRounds);
//       const newAdminDetails = new adminDetails({
//     name: name,
//     email: email,
//     password: hashedPassword,
//   });

//   await newAdminDetails.save();

//   }

  

  