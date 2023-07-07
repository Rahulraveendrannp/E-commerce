const userCollection=require("../../models/user/details");
const bannerCollection=require("../../models/admin/banner");
const productCollection=require("../../models/admin/product");


exports.viewAll = async (req, res) => {
  try {
    let  currentUser
    if (req.session.userID) {
     currentUser = await userCollection.findById(req.session.userID);
    }
    const banners = await bannerCollection.find({ active: true }).limit(3).sort({title:1});

    const allProducts=await productCollection.find({listed:true})
                                             .populate("category")
                                             .populate("brand").sort({_id:-1})
// console.log(allProducts);
   let newArrivals=allProducts.slice(0, 8);
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
   men=men.slice(0,8)
    res.render("index/landingPage", {
      session: req.session.userID,
      currentUser,
      newArrivals,
      men,
      women,
      banners,
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
