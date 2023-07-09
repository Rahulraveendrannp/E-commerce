const productManagerCollection=require("../../models/productManager/details");
const otpCollection=require("../../models/user/otp");
const nodemailer=require("nodemailer");



exports.viewPage=async(req,res)=>{
    try{
        res.render("productManager/partials/forgotPassword", {
            documentTitle: "Forgot Password | ProductManager",
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
       const emailCheck= await productManagerCollection.findOne({email:inputEmail});
       if(emailCheck){
        next()
       }else{
        res.render("productManager/partials/forgotPassword", {
            documentTitle: "Forgot Password | ProductManager | SHOE ZONE",
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
           transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
              console.log("otp sending error"+error);
            }else{
              console.log("Reset password OTP Sent: " + tempOTP);
            }
          });
          res.redirect("/productManager/forgotPassword/otpVerification");
    }
    catch(error){
        console.log("error sending otp " +error);
    }
}





exports.otpPage=async(req,res)=>{
    try{
        if (req.session.resetPasswordAuth && req.session.resetOTP) {
            res.render("productManager/partials/otp", {
              documentTitle: "Update Product Manager Password | SHOE ZONE",
              newUserDetails:null
            });
          } else {
            res.redirect("/productManager");
          }

    }
    catch(error){
        console.log("error on rendering otp page"+error)
    }
}

exports.otpVerification =async (req, res) => {
    if (req.session.resetPasswordAuth && req.session.resetOTP) {
    
      const resetOtpCheck = await otpCollection.findOne({otp:req.body.otp})
      if (resetOtpCheck) {
        req.session.resetOTP = false;
        req.session.updatePassword = true;
        console.log("Session created for product Manager password change");
        res.redirect("/productManager/changePassword");
      } else {
        res.render("user/partials/otp", {
          documentTitle: "Update product Manager Password | SHOE ZONE",
          errorMessage: "Invalid OTP",
          newUserDetails:null
        });
      }
    } else {
      res.redirect("/productManager");
    }
  };

exports.passwordChangePage=async(req,res)=>{
    try{
        if (req.session.updatePassword && req.session.resetPasswordAuth) {
            res.render("productManager/partials/changePassword", {
              documentTitle: " Password Reset | SHOE ZONE",
            });
          } else {
            res.redirect("/productManager/forgotPassword");
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

      await productManagerCollection.updateOne({email:userEmail},{$set:{password:newPassword}});
      req.session.updatePassword = false;
      req.session.resetPasswordAuth = false;
      console.log("User password updated.");
      res.redirect("/productManager");
      
    }else{

        res.redirect("/productManager");

    }}catch(error){
        console.log("password upadation error" +error)
    }
}