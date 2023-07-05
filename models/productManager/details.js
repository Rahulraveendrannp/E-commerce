const mongoose = require("mongoose");
const bcrypt= require("bcrypt")


const vendorSchema = new mongoose.Schema({
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
    number: {
      type: Number,
    },
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Orders",
      },
    ],
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Products",
      },
    ]
  });

  const vendorDetails=mongoose.model('VendorDetails',vendorSchema)
  module.exports=vendorDetails;
 


  // ------------- Create new vendor -----------

// exports.createVendor=async()=>{
//     const saltRounds =10;
//     const password=process.env.VENDOR_PASSWORD
//     const email=process.env.VENDOR_EMAIL
//     const name=process.env.VENDOR_NAME

//     const hashedPassword= await bcrypt.hash(password,saltRounds);
//       const newVendorDetails = new vendorDetails({
//     name: name,
//     email: email,
//     password: hashedPassword,
//   });

//   await newVendorDetails.save();

//   }

  

  