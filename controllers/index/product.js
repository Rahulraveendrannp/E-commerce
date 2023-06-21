const productCollection=require("../../models/admin/product");
const categoryCollection=require("../../models/admin/category");
const userCollection=require("../../models/user/details");
const wishlistCollection=require("../../models/user/wishlist")


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
        let reviews=null;
        let numberOfReviews=null
        let moment=null
        res.render("index/product", {
            documentTitle: productDetails.name,
            productDetails,
            session: req.session.userID,
            currentUser,
            productsInWishlist,
            reviews,
            numberOfReviews,
            moment
          });


    }catch(error){
        res.redirect("/")
        console.log("error rendering product page:"+error)
    }
}