const express =require('express');
const router=express.Router();
const landingPage=require("../controllers/index/landingPage")


// Landing Page
router.get("/", landingPage.viewAll);





module.exports=router