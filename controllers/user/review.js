const productCollection=require("../../controllers/admin/products");
const reviewCollection=require("../../models/user/reviews")



exports.addNew=async(req,res)=>{
    try{

        req.body.customer = req.session.userID;
        req.body.product = req.query.productID;
        console.log(req.body)
  await reviewCollection.create(req.body);
  res.json({
    succes: 1,
  });
    }catch(error){
         res.redirect('/');
        console.log("error on adding new review")
    }
 }

 exports.helpful = async (req, res) => {
  if (req.session.userID != undefined) {
    await reviewCollection.findByIdAndUpdate(req.body.reviewID, {
      $inc: {
        helpful: 1,
      },
    });
    res.json({
      success: 1,
    });
  } else {
    res.json({
      success: 0,
    });
  }
};