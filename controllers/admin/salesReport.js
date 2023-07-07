const orderCollection = require("../../models/user/orders");
const moment = require('moment');
const excelJS = require("exceljs");

exports.download = async (req, res) => {
    try {
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sales Report");
        worksheet.columns = [
            { header: "S No.", key: "s_no" },
            { header: "Order ID", key: "_id", width: 30 },
            { header: "Ordered On", key: "date", width: 20 },
            { header: "User", key: "user", width: 20 },
            { header: "Payment", key: "modeOfPayment" },
            { header: "Delivery", key: "orderStatus", width: 20 },
            { header: "Quantity", key: "item" },
            { header: "BIll Amount", key: "finalPrice", width: 15 },
            { header: "Revenue", key: "reportPrice", width: 15 },
        ];
        let counter = 1;
        let total = 0;
        let reportPrice = 0;
        const salesdata = await orderCollection
            .find({orderedOn:{
              $lte:new Date(req.body.todate),
              $gte:new Date(req.body.fromdate)

            }})
            .populate({ path: "customer", select: "name" });
     salesdata.forEach((sale,i)=>{
        const date = moment(sale.orderedOn).format("lll");
        const orderID = sale._id.toString();

        const status=()=>{
            if (sale.delivered === true) {
                return moment(sale.deliveredOn).format("lll");
              } else if (sale.delivered === false) {
                return sale.status;
              }
        };
        reportPrice += sale.finalPrice;
      sale.reportPrice = reportPrice;
      sale.date = date;
      sale._id = orderID;
      sale.s_no = counter;
      sale.orderStatus = status();
      sale.user = sale.customer.name;
      sale.item = sale.totalQuantity;
      worksheet.addRow(sale);
      counter++;
      total += sale.price;
     });
     res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheatml.sheet"
      );
  
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=SHOE_ZONE_E-Commerce_SalesReport.xlsx`
      );
  
      return workbook.xlsx.write(res).then(() => {
        res.status(200);
      });

    } catch (error) {
        console.log("error on downloading sales report : " + error)
    }
}