const orderCollection=require("../../models/user/orders");
const productCollection=require("../../models/admin/product");
const userCollection=require("../../models/user/details");
const moment=require("moment");

exports.view=async(req,res)=>{
    try{
        const recentOrders = await orderCollection
             .find()
             .sort({_id:-1})
             .populate({path:"customer", select:"email"});
        const orderCount=recentOrders.length;
        const productCount=await productCollection.count();
        const customerCount= await userCollection.count();
        let totalRevenue
        if(customerCount){
            totalRevenue= await orderCollection.aggregate([{
                $match:{
                    status :{
                        $nin:["cancelled","returned"]
                    }
                }

            },
               { $group:{
                    _id:0,
                    totalRevenue:{$sum:"$finalPrice"}

                }
            }
            ])
            totalRevenue=totalRevenue[0].totalRevenue;
        }else{
            totalRevenue=0;
        }

        res.render('admin/partials/dashboard',{
            session: req.session.admin,
            recentOrders,
            moment,
            orderCount,
            customerCount,
            productCount,
            totalRevenue,
            documentTitle: 'Admin Dashboard | SHOE ZONE'
        });
    }catch(error){
        console.log("Error rendering dashboard: " + error);
    }
    
}

exports.chartData=async(req,res)=>{
    try{
        let currentYear= new Date();
        currentYear= currentYear.getFullYear();
        let orderData= await orderCollection.aggregate([{
            $match:{
                status :{
                    $nin:["cancelled","returned"]
                }
            }

        },
            {
                $project:{
                    _id:0,
                    totalProducts:"$totalQuantity",
                    billAmount:"$finalPrice",
                    month:{
                        $month: "$orderedOn"
                    },
                    year:{
                        $year:"$orderedOn"
                    }
                }
            },
           {
            $group:{
               _id:{month : "$month" , year : "$year"},
               totalProducts : { $sum : "$totalProducts"},
               totalOrders: { $sum : 1},
               revenue: { $sum : "$billAmount"},
               avgBillPerOrder : { $avg : "$billAmount"}
            }
           },
           {
            $match :{
                "_id.year" :currentYear
            }
           },
           {
            $sort : { "_id.month" : 1}
           }
        ]);
        const delivered= await orderCollection.find({delivered : true}).count();
        const returned= await orderCollection.find({status: "returned"}).count();
        let notDelivered= await orderCollection.aggregate([
          {  $match : { delivered : false} },
          {
            $group:{
                _id: "$status",
                status:{ $sum : 1}
            }
          }
        ]);
        let inTransit;
        let cancelled;
        notDelivered.forEach(order=>{
            if(order._id === "In-transit"){
                inTransit=order.status
            }else if(order._id === "Cancelled"){
                cancelled =order.status
            }
        });
      res.json({
        data:{ orderData, inTransit, cancelled, delivered , returned }
      })

    }catch(error){
        cosole.log("error on getting chart data : "+error)
    }
}