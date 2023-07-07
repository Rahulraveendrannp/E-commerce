const categoryDetails=require("../../models/admin/category");
const brandDetails=require("../../models/admin/brand");
const productCollection=require("../../models/admin/product");
const sharp=require("sharp");
const mongoose = require("mongoose");

exports.viewPage=async(req,res)=>{
    try{
        const allCategories=await categoryDetails.find({});
        const allBrands=await brandDetails.find({});
        const allProducts= await productCollection.find().populate("category").populate("brand")

        res.render("productManager/partials/products", {
            documentTitle: "Product Management | SHOE ZONE",
            categories: allCategories,
            products: allProducts,
            brands: allBrands,
            session: req.session.productManager,
          })

    }catch(error){
        console.log("error on showing product page :"+error)
    }
}


exports.addProduct=async(req,res)=>{

    try{
        let frontImage = `${req.body.name}_frontImage_${Date.now()}.png`;
        sharp(req.files.frontImage[0].buffer)
          .toFormat("png")
          .png({quality:80})
          .toFile(`public/image/products/${frontImage}`);
        req.body.frontImage=frontImage;
        let thumbnail = `${req.body.name}_thumbnail_${Date.now()}.png`;
        sharp(req.files.thumbnail[0].buffer)
          .toFormat("png")
          .png({ quality: 80 })
          .toFile(`public/image/products/${thumbnail}`);
        req.body.thumbnail = thumbnail;
        const imageArray=[];
        for (i = 0; i < 3; i++) {
            imageName = `${req.body.name}_image${i}_${Date.now()}.png`;
            sharp(req.files.images[i].buffer)
              .toFormat("png")
              .png({ quality: 80 })
              .toFile(`public/image/products/${imageName}`);
            imageArray.push(imageName);
          }
          req.body.images = imageArray;
          req.body.category=new mongoose.Types.ObjectId(req.body.category);
          req.body.brand= new mongoose.Types.ObjectId(req.body.brand);
          const newProduct= new productCollection(req.body)
          await newProduct.save();
          console.log("Product added successfully");
          res.redirect("/productManager/products");
 
    }
    catch(error){
        console.log("Product adding error: " + error);
    }
}

exports.editPage=async(req,res)=>{
    try{
        const currentProduct= await productCollection
        .findById(req.query.id)
        .populate("category")
        .populate("brand")

        const categories=await categoryDetails.find({});
        const brands= await brandDetails.find({});
        res.render("productManager/partials/editProducts", {
            session: req.session.productManager,
            documentTitle: "Edit Product | SHOE ZONE",
            product: currentProduct,
            brands:brands,
            categories: categories,
          });

    }
    catch(error){
        console.log("product editing page error"+error);
    }
}

exports.edit = async (req, res) => {
    try {
      if (JSON.stringify(req.files) !== "{}") {
        console.log("req.files", req.files);
        if (req.files.frontImage) {
          let frontImage = `${req.body.name}_frontImage_${Date.now()}.png`;
          sharp(req.files.frontImage[0].buffer)
            .toFormat("png")
            .png({ quality: 80 })
            .toFile(`public/image/products/${frontImage}`);
          req.body.frontImage = frontImage;
        }
        if (req.files.thumbnail) {
          let thumbnail = `${req.body.name}_thumbnail_${Date.now()}.png`;
          sharp(req.files.thumbnail[0].buffer)
            .toFormat("png")
            .png({ quality: 80 })
            .toFile(`public/image/products/${thumbnail}`);
          req.body.thumbnail = thumbnail;
        }
        if (req.files.images) {
          const newArray = [];
          for (i = 0; i < 3; i++) {
            imageName = `${req.body.name}_image${i}_${Date.now()}.png`;
            sharp(req.files.images[i].buffer)
              .toFormat("png")
              .png({ quality: 80 })
              .toFile(`public/image/products/${imageName}`);
            newArray.push(imageName);
          }
          req.body.images = newArray;
        }
      }
      req.body.category = new mongoose.Types.ObjectId(req.body.category);
      req.body.brand= new mongoose.Types.ObjectId(req.body.brand);
      await productCollection.findByIdAndUpdate(req.query.id, req.body);
      console.log("Product edited successfully");
      res.redirect("/productManager/products");
    } catch (error) {
      console.log("Product editing POST error: " + error);
    }
  };
  
  exports.changeListing = async (req, res) => {
    try {
      const currentProduct = await productCollection.findById(req.query.id);
      let currentListing = currentProduct.listed;
      currentListing = ! currentListing
      await productCollection.findByIdAndUpdate(currentProduct._id, {
        listed: currentListing,
      });
      res.redirect("/productManager/products");
    } catch (error) {
      console.log("Product listing changing error: " + error);
    }
  };