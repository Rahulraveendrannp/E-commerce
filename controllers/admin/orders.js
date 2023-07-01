const orderCollection=require("../../models/user/orders");
const moment=require("moment");

exports.viewPage=async(req,res)=>{
    try{

        const allOrders=await orderCollection
             .find()
             .populate("customer","name email")
             .populate("couponUsed","name")
             .populate("summary.product","category name brand price")
             .populate("summary.product.category")
             .sort({_id:-1});
        res.render(
            "admin/partials/orders",{
                allOrders,
                documentTitle:"Orders | SHOE ZONE ",
                moment,
                session:req.session.admin
            }
        )
    }catch(error){
        res.redirect("/admin/dashboard")
        console.log("error on rendering order page :"+error)
    }
}

exports.detailsPage=async(req,res)=>{
    try{
      const  orderID=req.params.id;
      const currentOrder = await orderCollection
        .findById(orderID)
        .populate("summary.product")
        .populate("couponUsed");

        res.render("admin/partials/orderDetails", {
            session: req.session.admin,
            currentOrder,
            moment,
            documentTitle: "Order Details | SHOE ZONE",
          });
        
    }catch(error){
        res.redirect("/admin/dashboard")
        console.log("error on rendering product detail page")
    }
}

exports.deliver=async(req,res)=>{
    try{
        await orderCollection.findByIdAndUpdate(req.body.orderID,{
            $set:{
                delivered:true,
                deliveredOn: Date.now(),
                status:"delivered"
            }
        });
        res.json({
            data: { delivered: 1 },
          });

    }catch(error){
        res.redirect("/admin/dashboard")
        coonsole.log("erro on delivering product :"+error)
    }
}
exports.return=async(req,res)=>{
    try{
        await orderCollection.findByIdAndUpdate(req.body.orderID,{
            $set:{
                
                returnedOn: Date.now(),
                status:"returned",
                delivered:false
            }
        });
        res.json({
            data: { returned: 1 },
          });

    }catch(error){
        res.redirect("/admin/dashboard")
        coonsole.log("erro on returning product :"+error)
    }
}