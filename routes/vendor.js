const express =require('express');
const router=express.Router();
const signIn=require("../controllers/productManager/signIn")


// Sign In
router
  .route("/")
  .get(signIn.page)
  .post(signIn.verification)










module.exports=router