const express =require('express');
const router=express.Router();
const signIn=require("../controllers/admin/signin");
const dashboard=require("../controllers/admin/dashboard");
const customer=require("../controllers/admin/customers");
const categories=require("../controllers/admin/category");
const products=require("../controllers/admin/products");
const brands=require("../controllers/admin/brand");
const upload=require("../utilities/imageUpload");
const banner=require("../controllers/admin/banner");
const coupon =require("../controllers/admin/coupon");
const orders=require("../controllers/admin/orders");
const objectIdCheck=require("../middlewares/admin/objectIdCheck")
const sessionCheck=require("../middlewares/admin/sessionCheck");
const salesReport=require("../controllers/admin/salesReport")




// Sign In
router
  .route("/")
  .get(signIn.page)
  .post(signIn.verification)


// Dashboard
router
  .route("/dashboard")
  .get( dashboard.view)
  .put(dashboard.chartData)

// Sales Report
router
   .route("/salesReport")
   .get(salesReport.download);


// CustomerManagement
router
   .route("/customer_management")
   .get(customer.viewAll)
   .patch(customer.changeAccess)

// CategoryMnanagement
router
   .route("/categories")
   .get(categories.list)
   .post( categories.addCategory);

router
   .route("/categories/delete_category")
   .get(categories.deleteCategory);

router
   .route("/categories/edit")
   .get(categories.editCategoryPage)
   .post(categories.editCategory)

 
// Product Management
router.get("/products",products.viewpage);
router.post("/products/add_product", upload.fields([
   { name: "frontImage", maxCount: 1 },
   { name: "thumbnail", maxCount: 1 },
   { name: "images", maxCount: 3 },
 ]),products.addProduct)

router.get("/products/edit",products.editPage);
router.post("/products/edit",   
      upload.fields([
         { name: "frontImage", maxCount: 1 },
         { name: "thumbnail", maxCount: 1 },
         { name: "images", maxCount: 3 },
]),products.edit)
router.get(
   "/products/changeListing", 
   products.changeListing
 );
 
   
// brandMnanagement
router
   .route("/brands")
   .get(brands.list)
   .post( brands.addBrand);

router
   .route("/brands/delete_brand")
   .get(brands.deleteCategory);

router
   .route("/brands/edit")
   .get(brands.editBrandPage)
   .post(brands.editBrand)

// Banner Management
router
  .route("/banner_management")
  .get(banner.viewall)
  .post(upload.single("bannerImage"),banner.addBanner)
  .patch(banner.changeActivity)
  .delete(banner.deleteBanner)

// Coupon Management
router
     .route("/coupon_management")
     .get(coupon.viewPage)
     .post(coupon.addNew)
router.get("/coupon_management/changeActivity",coupon.changeActivity);

// order management
router
     .route("/orders")
     .get(orders.viewPage)
     .patch( orders.deliver);

router
     .route("/orders/:id")
     .get(objectIdCheck, orders.detailsPage);

 module.exports=router
  
