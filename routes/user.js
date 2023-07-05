const express =require('express');
const router=express.Router();
const signUp=require("../controllers/user/signUp");
const signIn=require("../controllers/user/signIn");
const forgotPassword=require("../controllers/user/forgotPassword");
const wishlist=require("../controllers/user/wishlist");
const profile=require("../controllers/user/profile");
const imageUpload=require("../utilities/imageUpload");
const imageProcessor=require("../utilities/imageProcessor");
const sessionCheck=require("../middlewares/users/sessionCheck");
const signOut=require("../controllers/user/signOut");
const cart=require("../controllers/user/cart");
const checkout=require("../controllers/user/checkout");
const address=require("../controllers/user/address");
const reviews=require("../controllers/user/review");
const orders=require("../controllers/user/order");
const objectIdCheck=require("../middlewares/users/objectIdCheck")
const croppedImgupload=require("../utilities/croppedImgUpload")



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

// Wishlist
router
  .route("/wishlist")
  .get(sessionCheck,wishlist.viewWishlist)
  .patch(wishlist.addOrRemove)
  .delete(wishlist.remove)

// Cart
router
  .route("/cart")
  .get(sessionCheck, cart.viewCart)
  .post(sessionCheck, cart.addToCart)
  .delete(sessionCheck,cart.removeProduct)
  .put(sessionCheck,cart.countChange)



// Profile
router
  .route("/profile")
  .get(sessionCheck,profile.viewPage)
  .post(sessionCheck,croppedImgupload.single("photo"),profile.upadteUser)

 

// Checkout
router
  .route("/cart/checkout")
  .get(sessionCheck,checkout.viewPage)
  .put(sessionCheck,checkout.couponCheck)
  .post(sessionCheck,checkout.checkout)

router.get("/cart/checkout/:id",  checkout.result);

router.post("/cart/checkout/:id",async(req,res)=>{
     const transactionID=req.params.id;
     console.log(transactionID)
     res.redirect(`/users/cart/checkout/${transactionID}`)
})

router.post("/cart/checkout/changeDefaultAddress",sessionCheck,checkout.defaultAddress)



// Addresses
router.get("/addresses", sessionCheck, address.viewPage);
router.post("/addresses/addNew", sessionCheck, address.addNew);
router.get("/addresses/delete", sessionCheck, address.deleteAddress);
router.get("/addresses/changeRole", sessionCheck, address.defaultToggler);
  
//reviews
router
  .route("/reviews")
  .post(sessionCheck, reviews.addNew)
  .patch(reviews.helpful);

//Order
router
   .route("/orders")
   .get(orders.viewPage)
router
   .route("/orders/:id")
   .get(sessionCheck, objectIdCheck, orders.details)
   .patch(sessionCheck, objectIdCheck, orders.cancel)
   .put(sessionCheck, objectIdCheck, orders.return)

// Sign out
router.get("/signOut", sessionCheck,signOut);


module.exports=router