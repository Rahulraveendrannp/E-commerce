const express =require('express');
const router=express.Router();
const landingPage=require("../controllers/index/landingPage");
const productListing=require("../controllers/index/productListing");
const objectIdCheck=require("../middlewares/users/objectIdCheck");
const product=require("../controllers/index/product")


// Landing Page
router.get("/", landingPage.viewAll);

//Our Collection

router
    .route("/products")
    .get(productListing.ourCollection)
    .patch(productListing.filter)
    .post(productListing.sortBy)
    .put(productListing.search)

router.get("/categories", productListing.categories);

// Single product Page
router
  .route("/products/:id")
  .get(objectIdCheck,product.view)





module.exports=router