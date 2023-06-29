const moment = require("moment");
const orderCollection = require("../../models/user/orders")
exports.viewPage = async (req, res) => {
    try {
        allOrders = await orderCollection
            .find({ customer: req.session.userID })
            .sort({ _id: 1 })
            .populate("customer")
            .populate("couponUsed")
        res.render("user/profile/partials/orders", {
            documentTitle: "My Orders | SHOE ZONE",
            allOrders,
            moment,
        });
    } catch (error) {
        res.redirect('/');
        console.log("error on rendering order page")
    }
}
exports.details=async(req,res)=>{
    try{
        const currentOrder = await orderCollection
      .findById(req.params.id)
      .populate("summary.product")
      .populate("couponUsed")
      .sort("");
    if (currentOrder) {
      res.render("user/profile/partials/orderDetails", {
        documentTitle: "Order Details | SHOE ZONE",
        currentOrder,
        moment,
      });
    } else {
      res.redirect("/pageNotFound");
    }

    }catch(error){
        console.log("error on getting order detail page :"+error)
    }
}


exports.cancel = async (req, res) => {
    await orderCollection.findByIdAndUpdate(req.params.id, {
      $set: {
        status: 'Cancelled',
        deliveredOn: null
      }
    })
    res.json({
      success: 'cancelled'
    })
  }

