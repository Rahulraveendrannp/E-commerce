const bcrypt=require("bcrypt");
const userDetails=require("../../models/user/details");
const saltRounds =10;
const cartCollection=require("../../models/user/cart");
const wishlistCollection=require("../../models/user/wishlist");
const nodemailer=require("nodemailer");
const otpCollection=require("../../models/user/otp");
const mongoose=require("mongoose");
// const twilio=require("twilio")("ACe8cfe177051de281085051d8cca8d58d","1da4d73254d7202f55bd308346c2faee");



exports.signUpPage = (req, res) => {
    try {
      res.render("user/partials/signUp", {
        documentTitle: "User Sign Up | SHOE ZONE",
      });
    } catch (error) {
      console.log("Error rendering user signup page: " + error);
    }
  };

  exports.registerUser = async (req, res,next) => {
    try{
      const email = req.body.email.toLowerCase();
     const number = req.body.number;
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
      const newUserDetails = {
        name: req.body.name.trim(),
        number: number,
        email: email.toLowerCase(),
        password: hashedPassword,
      };
      req.session.newUserDetails = newUserDetails;
      const emailCheck= await userDetails.findOne({email:email})
     const numberCheck= await userDetails.findOne({number:number})
      if (emailCheck || numberCheck) {
        res.render("user/partials/signUp", {
          documentTitle: "User Sign Up | SHOE ZONE",
          errorMessage: "User already existing",
        });
      }else{
        next();
      }
      
     
    }
    catch(error){
console.log("user registeratiion error"+error)
      
    }
  }

exports.sendOtp=async(req,res)=>{
  try{
    if(req.session.newUserDetails){
    const email = req.session.newUserDetails.email;
    // const number = req.session.newUserDetails.number;
     
      const tempOTP = Math.floor(Math.random() * (99999 - 10000 + 1))+ 25385;
      const newOtp=new otpCollection({
        email:email.toLowerCase(),
        otp:tempOTP,
      })

      await newOtp.save();
       // Transporter
       const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user:process.env.TRANSPORTER_USERNAME,
            pass: process.env.TRANSPORTER_PASSWORD
        }
    });

      // Mail options
     const mailOptions =  {
        from:process.env.TRANSPORTER_USERNAME,
        to:email,
        subject: "OTP Verification | SHOE ZONE eCommerce",
        html: `<h1>OTP</h1></br><h2 style="text-color: red, font-weight: bold">${tempOTP}</h2></br><p>Enter the OTP to create account.</p>`,
      };

      // Send mail
      await transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
          console.log("otp sending error"+error);
        }else{
          console.log("Account creation OTP Sent: " + tempOTP);
        }
      });

      //twilio

      // twilio.messages.create({
      //   from:process.env.Twilio_ph_no,
      //   to: "+91"+req.session.newUserDetails.number ,
      //   body: `<h1>OTP</h1></br><h2 style="text-color: red, font-weight: bold">${tempOTP}</h2></br><p>Enter the OTP to create account.</p>`
      // }).then((res)=>{console.log("message sent by twilio")}).catch((err)=>{console.log("error :"+err)})

      

      
      res.redirect("/users/otp_verification");
    
    }else{
      res.redirect("/users/signIn")
    }
  }catch(error){
    console.log("error sending otp "+error)
  }
}






 
 exports.otpPage = (req, res) => {
    try {
      const newUserDetails=req.session.newUserDetails;
      res.render("user/partials/otp", {
        documentTitle: "OTP Verification | SHOE ZONE",
        newUserDetails:newUserDetails,
      });
    } catch (error) {
      console.log("Error rendering OTP Page: " + error);
    }
  };

  exports.otpVerification = async (req, res) => { try {
    const otpChecker= await otpCollection.findOne({otp:req.body.otp})
    if (otpChecker) {
        const newUserDetails = new userDetails(req.session.newUserDetails);
        newUserDetails.save();
        res.redirect("/users/signIn");
        const existUserDetails= await userDetails.findOne({email:otpChecker.email})
        const userID = existUserDetails._id;
        const newCart = new cartCollection({
          customer:new  mongoose.Types.ObjectId(userID),
        });
        await userDetails.findByIdAndUpdate(userID, {
          $set: { cart:new mongoose.Types.ObjectId(newCart._id) },
        });
        await newCart.save();
        const newWishlist = new wishlistCollection({
          customer:new mongoose.Types.ObjectId(userID),
        });
        await userDetails.findByIdAndUpdate(userID, {
          $set: { wishlist:new mongoose.Types.ObjectId(newWishlist._id) },
        });
        await newWishlist.save();
      } else {
        res.render("user/partials/otp", {
          documentTitle: "OTP Verification | SHOE ZONE",
          errorMessage: "Invalid OTP",
          newUserDetails:null,

        });
      }
   
  } catch (error) {
    console.log("Error verifying OTP: " + error);
  }}


