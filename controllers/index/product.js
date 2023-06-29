const productCollection=require("../../models/admin/product");
const categoryCollection=require("../../models/admin/category");
const userCollection=require("../../models/user/details");
const wishlistCollection=require("../../models/user/wishlist");
const reviewCollection=require("../../models/user/reviews.js")
const moment=require("moment");


exports.view=async(req,res)=>{
    try{
        const currentUser= await  userCollection.findById(req.session.userID);
        const productDetails=await productCollection.findById(req.params.id).populate("brand").populate("category");
        let productsInWishlist=null
        if(currentUser){
            productsInWishlist= await wishlistCollection.findOne({
                customer:currentUser._id,
                products:req.params.id
            });
        }
        let reviews = await reviewCollection.find({ product: productDetails._id })
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "customer",
        select: "name photo",
      });
    const numberOfReviews = reviews.length;
    reviews = reviews.slice(0, 6);
    if (reviews == "") {
      reviews = null;
    }
    const similarProducts= await  productCollection.find({}).sort({_id:1}).limit(10)
       
        res.render("index/product", {
            documentTitle: productDetails.name,
            productDetails,
            session: req.session.userID,
            currentUser,
            productsInWishlist,
            reviews,
            numberOfReviews,
            moment,
            listing:similarProducts
          });


    }catch(error){
        res.redirect("/")
        console.log("error rendering product page:"+error)
    }
}