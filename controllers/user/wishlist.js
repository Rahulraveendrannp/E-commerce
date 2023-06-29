const wishlistCollection = require("../../models/user/wishlist");
const productCollection=require("../../models/admin/product")

exports.viewWishlist=async(req,res)=>{
    try{
        const userWishlist= await wishlistCollection
                                       .findOne({customer:req.session.userID})
                                       .populate({path:"products",populate:{path:"brand"}})
        
        res.render("user/profile/partials/wishlist",{
            userWishlist,
            documentTitle: "Your Wishlist | SHOE ZONE",
            session:req.session.userID
        });
    }catch(error){
        res.redirect('/');
        console.log("error on rendering cart page:" + error)
    }
}

exports.addOrRemove=async(req,res)=>{
    try{
        const userWishlist= await wishlistCollection.findOne({
            customer: req.session.userID,
          });
        if(userWishlist){
        const product=await productCollection.findById(req.body.id);
        const prodExist=await wishlistCollection.findOne({
            _id: userWishlist._id,
            products: req.body.id,
        });
        if(!prodExist){
            await wishlistCollection.updateOne({
                _id: userWishlist._id,
              },{
                $push:{products:req.body.id}
            });
            res.json({
                data: {
                  added: 1,
                },
              });
        }else{
            await wishlistCollection.updateOne({
                _id: userWishlist._id,
              },{
                $pull:{products:req.body.id}
            });
            res.json({
                data: {
                  added: 0,
                },
              });

        }
        }else{
            res.json({
                data: {
                  added: null,
                },
              });
        }

     
        
    }catch(error){
        
        console.log("error on adding or removing to cart:" + error);
        res.redirect('/');
    }
}

exports.remove=async(req,res)=>{
    try{
        const userWishlist= await wishlistCollection.findOne({
            customer: req.session.userID,
          });
     await wishlistCollection.updateOne({
            _id: userWishlist._id,
          },{
            $pull:{products:req.body.productID}
        });
        res.json({
            data: {
              deleted: 1,
            },
          });


    }catch(error){
        res.redirect('/');
        console.log("error on removing wishlist product: "+error)
    }
}