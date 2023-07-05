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
  .get(sessionCheck, dashboard.view)
  .put(sessionCheck,dashboard.chartData)

router.get("/chart/:id",dashboard.customChartData)

// Sales Report
router
   .route("/salesReport")
   .get(sessionCheck,salesReport.download);


// CustomerManagement
router
   .route("/customer_management")
   .get(sessionCheck,customer.viewAll)
   .patch(sessionCheck,customer.changeAccess)

// CategoryMnanagement
router
   .route("/categories")
   .get(categories.list)
   .post( categories.addCategory);

router
   .route("/categories/delete_category")
   .get(sessionCheck,categories.deleteCategory);

router
   .route("/categories/edit")
   .get(sessionCheck,categories.editCategoryPage)
   .post(sessionCheck,categories.editCategory)

 
// Product Management
router.get("/products",sessionCheck,products.viewpage);
router.post("/products/add_product",sessionCheck, upload.fields([
   { name: "frontImage", maxCount: 1 },
   { name: "thumbnail", maxCount: 1 },
   { name: "images", maxCount: 3 },
 ]),products.addProduct)

router.get("/products/edit",sessionCheck,products.editPage);
router.post("/products/edit",sessionCheck,   
      upload.fields([
         { name: "frontImage", maxCount: 1 },
         { name: "thumbnail", maxCount: 1 },
         { name: "images", maxCount: 3 },
]),products.edit)
router.get(
   "/products/changeListing",sessionCheck, 
   products.changeListing
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

// Banner Management
router
  .route("/banner_management")
  .get(sessionCheck,banner.viewall)
  .post(sessionCheck,upload.single("bannerImage"),banner.addBanner)
  .patch(sessionCheck,banner.changeActivity)
  .delete(sessionCheck,banner.deleteBanner)

// Coupon Management
router
     .route("/coupon_management")
     .get(sessionCheck,coupon.viewPage)
     .post(sessionCheck,coupon.addNew)
router.get("/coupon_management/changeActivity",coupon.changeActivity);

// order management
router
     .route("/orders")
     .get(sessionCheck,orders.viewPage)
     .patch(sessionCheck, orders.deliver)
     .put(sessionCheck, orders.return)

router
     .route("/orders/:id")
     .get(sessionCheck,objectIdCheck, orders.detailsPage);

 module.exports=router
  
