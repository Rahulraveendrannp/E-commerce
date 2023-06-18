const express =require('express');
const router=express.Router();
const signUp=require("../controllers/user/signUp");
const signIn=require("../controllers/user/signIn");
const forgotPassword=require("../controllers/user/forgotPassword")




// Sign Up
 router
  .route("/signUp")
  .get(signUp.signUpPage)
  .post(signUp.registerUser,signUp.sendOtp);


 router.get("/signUp/resend_OTP",signUp.sendOtp)

 router
  .route("/otp_verification")
  .get(signUp.otpPage)
  .post(signUp.otpVerification);


 // Sign in
 router
    .route("/signIn")
    .get(signIn.signInPage)
    .post(signIn.verifyUser)



// Password Section
router
  .route("/forgotPassword")
  .get(forgotPassword.viewPage)
  .post(forgotPassword.emailVerification,forgotPassword.otpSend)
  router.get("/forgotPassword/otpVerification/resend_OTP",forgotPassword.otpSend)

router.get("/forgotPassword/otpVerification", forgotPassword.otpPage);
router.post("/forgotPassword/otpVerification", forgotPassword.otpVerification);

router.get("/changePassword",forgotPassword.passwordChangePage);
router.post("/changePassword",forgotPassword.updatePassword);


  






module.exports=router