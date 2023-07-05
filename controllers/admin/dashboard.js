const orderCollection = require("../../models/user/orders");
const productCollection = require("../../models/admin/product");
const userCollection = require("../../models/user/details");
const moment = require("moment");

exports.view = async (req, res) => {
    try {
        const recentOrders = await orderCollection
            .find()
            .sort({ _id: -1 })
            .populate({ path: "customer", select: "email" });
        const orderCount = recentOrders.length;
        const productCount = await productCollection.count();
        const customerCount = await userCollection.count();
        let totalRevenue
        if (customerCount) {
            totalRevenue = await orderCollection.aggregate([{
                $match: {
                    status: {
                        $nin: ["cancelled", "returned"]
                    }
                }

            },
            {
                $group: {
                    _id: 0,
                    totalRevenue: { $sum: "$finalPrice" }

                }
            }
            ])
            totalRevenue = totalRevenue[0].totalRevenue;
        } else {
            totalRevenue = 0;
        }

        res.render('admin/partials/dashboard', {
            session: req.session.admin,
            recentOrders,
            moment,
            orderCount,
            customerCount,
            productCount,
            totalRevenue,
            documentTitle: 'Admin Dashboard | SHOE ZONE'
        });
    } catch (error) {
        console.log("Error rendering dashboard: " + error);
    }

}

exports.chartData = async (req, res) => {
    try {
        
        let currentYear = new Date();
        currentYear = currentYear.getFullYear();
        let orderData = await orderCollection.aggregate([{
            $match: {
                status: {
                    $nin: ["cancelled", "returned"]
                }
            }

        },
        {
            $project: {
                _id: 0,
                totalProducts: "$totalQuantity",
                billAmount: "$finalPrice",
                week: {
                    $dayOfWeek: "$orderedOn"
                },
                month: {
                    $month: "$orderedOn"
                },
                year: {
                    $year: "$orderedOn"
                },

            }
        },
        {
            $group: {
                _id: { month: "$month", year: "$year" },
                totalProducts: { $sum: "$totalProducts" },
                totalOrders: { $sum: 1 },
                revenue: { $sum: "$billAmount" },
                avgBillPerOrder: { $avg: "$billAmount" }
            }
        },
        {
            $match: {
                "_id.year": currentYear
            }
        },
        {
            $sort: { "_id.month": 1 }
        }
        ]);

        const delivered = await orderCollection.find({ delivered: true }).count();
        const returned = await orderCollection.find({ status: "returned" }).count();
        let notDelivered = await orderCollection.aggregate([
            { $match: { delivered: false } },
            {
                $group: {
                    _id: "$status",
                    status: { $sum: 1 }
                }
            }
        ]);
        let inTransit;
        let cancelled;
        notDelivered.forEach(order => {
            if (order._id === "In-transit") {
                inTransit = order.status
            } else if (order._id === "Cancelled") {
                cancelled = order.status
            }
        });
        res.json({
            data: { orderData, inTransit, cancelled, delivered, returned }
        })
      

        

    } catch (error) {
        console.log("error on getting chart data : " + error)
    }
}


exports.customChartData=async(req,res)=>{
    try{
        const period=req.params.id 
        console.log(period)
        if(period=="lastmonth"){
            let delivered= await orderCollection.aggregate([{
                $match:{$and:[{delivered:true},{orderedOn:{$gte : new Date(new Date().getTime()-(30*24*60*60*1000))}}]}
            }]);
                 delivered=delivered.length;
            let returned= await orderCollection.aggregate([{
                $match:{$and:[{status: "returned" },{returnedOn:{$gte : new Date(new Date().getTime()-(30*24*60*60*1000))}}]}
            }]);
             returned=returned.length;
    
            let notDelivered = await orderCollection.aggregate([
                { $match: {$and:[{delivered:false},{orderedOn:{$gte : new Date(new Date().getTime()-(30*24*60*60*1000))}}]} },
                {
                    $group: {
                        _id: "$status",
                        status: { $sum: 1 }
                    }
                }
            ]);
            let inTransit;
            let cancelled;
            notDelivered.forEach(order => {
                if (order._id === "In-transit") {
                    inTransit = order.status
                } else if (order._id === "Cancelled") {
                    cancelled = order.status
                }
            });
            res.json({
                data: {inTransit, cancelled, delivered, returned }
            })
    
            

        }
       else if(period=="lastweek"){

            let delivered= await orderCollection.aggregate([{
                $match:{$and:[{delivered:true},{orderedOn:{$gte : new Date(new Date().getTime()-(6*24*60*60*1000))}}]}
            }]);
                 delivered=delivered.length;
            let returned= await orderCollection.aggregate([{
                $match:{$and:[{status: "returned" },{returnedOn:{$gte : new Date(new Date().getTime()-(6*24*60*60*1000))}}]}
            }]);
             returned=returned.length;
    
            let notDelivered = await orderCollection.aggregate([
                { $match: {$and:[{delivered:false},{orderedOn:{$gte : new Date(new Date().getTime()-(6*24*60*60*1000))}}]} },
                {
                    $group: {
                        _id: "$status",
                        status: { $sum: 1 }
                    }
                }
            ]);
            let inTransit;
            let cancelled;
            notDelivered.forEach(order => {
                if (order._id === "In-transit") {
                    inTransit = order.status
                } else if (order._id === "Cancelled") {
                    cancelled = order.status
                }
            });
            res.json({
                data: {inTransit, cancelled, delivered, returned }
            })
    
    
          }
          else if(period=="last3month"){

            let delivered= await orderCollection.aggregate([{
                $match:{$and:[{delivered:true},{orderedOn:{$gte : new Date(new Date().getTime()-(90*24*60*60*1000))}}]}
            }]);
                 delivered=delivered.length;
            let returned= await orderCollection.aggregate([{
                $match:{$and:[{status: "returned" },{returnedOn:{$gte : new Date(new Date().getTime()-(90*24*60*60*1000))}}]}
            }]);
             returned=returned.length;
    
            let notDelivered = await orderCollection.aggregate([
                { $match: {$and:[{delivered:false},{orderedOn:{$gte : new Date(new Date().getTime()-(90*24*60*60*1000))}}]} },
                {
                    $group: {
                        _id: "$status",
                        status: { $sum: 1 }
                    }
                }
            ]);
            let inTransit;
            let cancelled;
            notDelivered.forEach(order => {
                if (order._id === "In-transit") {
                    inTransit = order.status
                } else if (order._id === "Cancelled") {
                    cancelled = order.status
                }
            });
            res.json({
                data: {inTransit, cancelled, delivered, returned }
            })
    
    
          }

    }catch(error){
        console.log("error on getting custom cahrt data"+error)
    }
}