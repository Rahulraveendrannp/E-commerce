const userCollection=require("../../models/user/details");
const otpCollection=require("../../models/user/otp");
const nodemailer=require("nodemailer");
const bcrypt=require("bcrypt")


exports.viewPage=async(req,res)=>{
    try{
        res.render("user/partials/forgotPassword", {
            documentTitle: "Forgot Password | User",
          })
    }
    catch(error){
        console.log("error rendering forgot password page"+error)
    }
}

exports.emailVerification=async(req,res,next)=>{

    try{
        
       const inputEmail=req.body.email;
       req.session.resetPasswordAuth = inputEmail;
       const emailCheck= await userCollection.findOne({email:inputEmail});
       if(emailCheck){
        next()
       }else{
        res.render("user/partials/forgotPassword", {
            documentTitle: "Forgot Password | User | SHOE ZONE",
            errorMessage: "User not found",
          });
       }

    }
    catch(error){
        console.log("error on email verification"+error);
    }
}

exports.otpSend=async(req,res)=>{
    try{
        inputEmail=req.session.resetPasswordAuth ;
        const tempOTP = Math.floor(Math.random() * (99999 - 10000 + 1))+ 25385;
        const newOtp=new otpCollection({
            email:inputEmail,
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
        req.session.resetOTP = tempOTP;
          // Mail options
         const mailOptions =  {
            from:process.env.TRANSPORTER_USERNAME,
            to:inputEmail,
            subject: "Password Reset OTP | SHOE ZONE eCommerce",
            html: `<h1>OTP</h1></br><h2 style="text-color: red, font-weight: bold">${tempOTP}</h2></br><p>Enter the OTP to reset password.</p>`,
          };
    
          // Send mail
          await transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
              console.log("otp sending error"+error);
            }else{
              console.log("Reset password OTP Sent: " + tempOTP);
            }
          });
          res.redirect("/users/forgotPassword/otpVerification");
    }
    catch(error){
        console.log("error sending otp " +error);
    }
}





exports.otpPage=async(req,res)=>{
    try{
        if (req.session.resetPasswordAuth && req.session.resetOTP) {
            res.render("user/partials/otp", {
              documentTitle: "Update User Password | SHOE ZONE",
              newUserDetails:null
            });
          } else {
            res.redirect("/users/signIn");
          }

    }
    catch(error){
        console.log("error on rendering otppage"+error)
    }
}

exports.otpVerification =async (req, res) => {
    if (req.session.resetPasswordAuth && req.session.resetOTP) {
    
      const resetOtpCheck = await otpCollection.findOne({otp:req.body.otp})
      if (resetOtpCheck) {
        req.session.resetOTP = false;
        req.session.updatePassword = true;
        console.log("Session created for user password change");
        res.redirect("/users/changePassword");
      } else {
        res.render("user/partials/otp", {
          documentTitle: "Update User Password | SHOE ZONE",
          errorMessage: "Invalid OTP",
          newUserDetails:null
        });
      }
    } else {
      res.redirect("/users/signIn");
    }
  };

exports.passwordChangePage=async(req,res)=>{
    try{
        if (req.session.updatePassword && req.session.resetPasswordAuth) {
            res.render("user/partials/changePassword", {
              documentTitle: "User Password Reset | SHOE ZONE",
            });
          } else {
            res.redirect("/users/forgotPassword");
          }
    }
    catch(error){
        console.log("error on rendering passwordchange page "+ error)
    }
}

exports.updatePassword=async(req,res)=>{
   try{ if (req.session.resetPasswordAuth && req.session.updatePassword) {
      const  userEmail=req.session.resetPasswordAuth;
      const newPassword=req.body.newPassword;
      const hashedPassword= await bcrypt.hash(newPassword,10);
      await userCollection.updateOne({email:userEmail},{$set:{password:hashedPassword}});
      req.session.updatePassword = false;
      req.session.resetPasswordAuth = false;
      console.log("User password updated.");
      res.redirect("/users/signIn");
      
    }else{

        res.redirect("/users/signIn");

    }}catch(error){
        console.log("password upadation error" +error)
    }
}