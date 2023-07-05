const couponCollection=require("../../models/admin/coupons");
const moment=require("moment");
const categoryCollection=require("../../models/admin/category")


exports.viewPage=async(req,res)=>{
    try{
        const coupons = await couponCollection.find();
        const categories=await categoryCollection.find()

    res.render("admin/partials/coupons", {
      session: req.session.admin,
      documentTitle: "Coupon Management",
      coupons,
      moment,
      categories
    });

    }catch(error){
        res.redirect("/admin/dashboard")
        console.log("error rendering coupon page "+error)
    }
}

exports.addNew = async (req, res) => {
    try {
      await couponCollection.create(req.body);
      res.redirect("/admin/coupon_management");
    } catch (error) {
        res.redirect("/admin/coupon_management")
      console.log("Error adding new coupon: " + error);
    }
  };

exports.changeActivity=async(req,res)=>{
    try{
        couponID=req.query.id;
        console.log(couponID)
        const currentCoupon=await couponCollection.findById(couponID);
        let currentActivity=currentCoupon.active;
        console.log(currentActivity);
        currentActivity= ! currentActivity ; 
        console.log(currentActivity);  
        await couponCollection.findByIdAndUpdate(couponID, {
            $set: { active: currentActivity },
          });
          res.redirect("/admin/coupon_management");     
    }catch(error){
        res.redirect("/admin/coupon_management")
        console.log("error on chnaging coupon activity :"+error)
    }
}