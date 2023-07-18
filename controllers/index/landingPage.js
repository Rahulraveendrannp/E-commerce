const userCollection=require("../../models/user/details");
const bannerCollection=require("../../models/admin/banner");
const productCollection=require("../../models/admin/product");
const categoryCollection=require("../../models/user/cart");
const cartCollection = require("../../models/user/cart");


exports.viewAll = async (req, res) => {
  try {
    let  currentUser
    let  userCart
    if (req.session.userID) {
     currentUser = await userCollection.findById(req.session.userID);
     userCart= await cartCollection.findOne({customer:req.session.userID})

    }
    const banners = await bannerCollection.find({ active: true }).limit(3).sort({title:1});
    const allProducts=await productCollection.find({listed:true})
                                             .populate("category")
                                             .populate("brand").sort({_id:-1})
// console.log(allProducts);
   let newArrivals=allProducts.slice(0, 4);
   let men=[]
   let women=[]
   let kids=[]

    allProducts.forEach((product)=>{
      if(product.category.name=="men"){
        men.push(product)
      }else if(product.category.name =="women"){
        women.push(product)
      }else{
        kids.push(product)
      }
    })
   men=men.slice(0,4)
   women=women.slice(0,4)
    res.render("index/landingPage", {
      session: req.session.userID,
      currentUser,
      newArrivals,
      men,
      women,
      banners,
      userCart
    });
  
  } catch (error) {
    console.log("Error rendering landing page: " + error);
  }
};

exports.errorPage=(req,res)=>{
  res.render("index/404",{
    url:req.session.url
  })
    

}
