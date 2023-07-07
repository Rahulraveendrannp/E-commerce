const express =require('express');
const router=express.Router();
const signIn=require("../controllers/productManager/signIn");
const product=require("../controllers/productManager/product")
const sessionCheck=require("../middlewares/productManager/sessionCheck");
const upload=require("../utilities/imageUpload");
const brands=require("../controllers/productManager/brand");
const orders=require("../controllers/productManager/orders");
const objectIdCheck=require("../middlewares/productManager/objectIdCheck");
const coupon=require("../controllers/productManager/coupon")



// Sign In
router
  .route("/")
  .get(signIn.page)
  .post(signIn.verification)

//products
router
   .route("/products")
   .get(sessionCheck,product.viewPage)
router.post("/products/add_product",sessionCheck, upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 3 },
  ]),product.addProduct)
 
router.get("/products/edit",sessionCheck,product.editPage);
router.post("/products/edit",sessionCheck,   
       upload.fields([
          { name: "frontImage", maxCount: 1 },
          { name: "thumbnail", maxCount: 1 },
          { name: "images", maxCount: 3 },
 ]),product.edit)
router.get(
    "/products/changeListing",sessionCheck, 
    product.changeListing
  );

// brandMnanagement
router
   .route("/brands")
   .get(sessionCheck,brands.list)
   .post(sessionCheck, brands.addBrand);

router
   .route("/brands/delete_brand")
   .get(sessionCheck,brands.deleteCategory);

router
   .route("/brands/edit")
   .get(sessionCheck,brands.editBrandPage)
   .post(sessionCheck,brands.editBrand)

// order management
router
     .route("/orders")
     .get(sessionCheck,orders.viewPage)
     .patch(sessionCheck, orders.deliver)
     .put(sessionCheck, orders.return)

router.get("/orders/:id",sessionCheck,objectIdCheck, orders.detailsPage);

// Coupon Management
router
     .route("/coupon_management")
     .get(sessionCheck,coupon.viewPage)
     .post(sessionCheck,coupon.addNew)
router.get("/coupon_management/changeActivity",coupon.changeActivity);










module.exports=router