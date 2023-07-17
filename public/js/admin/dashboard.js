let inTransit;
let cancelled ;
let delivered;
let returned ;



//douhnutchart


const ctz = document.getElementById("myChart3");
let chart=new Chart(ctz, {
  type: "doughnut",
  data: {
    labels: ["In-Transit", "Delivered", "Cancelled","Returned"],
    datasets: [
      {
        label: "Order Status",
        data: [inTransit, delivered, cancelled , returned ],

        backgroundColor: [
          "rgb(255, 205, 86,0.9)",
          "rgb(34,139,34,0.9)",
          "rgb(255,80,66,0.9)",
          "rgb(55, 32, 138,0.9)"
        ],
        hoverOffset: 10,
      },
    ],
  },
  
});





$.ajax({
    url: "/admin/dashboard",
    method: "PUT",
    success : (res)=>{
        let orderData=res.data.orderData;
        let totalOrders = [];
        let revenuePerMonth = [];
        let avgBillPerOrder = [];
        let productsPerMonth = [];
    orderData.forEach(order => {
        totalOrders[order._id.month-1]=order.totalOrders;
        revenuePerMonth[order._id.month-1]=order.revenue;
        avgBillPerOrder[order._id.month-1]=order.avgBillPerOrder;
        productsPerMonth[order._id.month-1]=order.totalProducts;
        
    });
   
    const monthDetails=["Jan", "Feb", "Mar","Apr","May","Jun","Jul", "Aug","Sep", "Oct","Nov","Dec",];
    const ctx=document.getElementById("myChart");
    new Chart(ctx,{
        type:"bar",
        data:{
            labels: monthDetails,
            datasets:[
                {
                    label: "Revenue",
                    data: revenuePerMonth,
                    borderWidth: 1, 
                    backgroundColor: "rgba(255, 99, 132, 0.4)",
                    borderColor: "rgb(255, 99, 132)",
                  },
                  {
                    label: "Avg. Bill per Order",
                    data: avgBillPerOrder,
                    borderWidth: 1,
                    backgroundColor: "rgba(255, 159, 64, 0.4)",
                    borderColor: "rgb(255, 159, 64)",
                  }
            ]
        },
        options:{
            scales: {
                y: {
                  beginAtZero: true,
                },
              },
        }
    });

    inTransit = res.data.inTransit;
     cancelled = res.data.cancelled;
     delivered = res.data.delivered;
     returned = res.data.returned;
     chart.data.datasets[0].data=[inTransit, delivered, cancelled , returned ];

          chart.update();

    const cty = document.getElementById("myChart2");
    new Chart(cty, {
      type: "bar",
      data: {
        labels:monthDetails,
        datasets: [
          {
            label: "Orders",
            data: totalOrders,
            borderWidth: 1,
            backgroundColor: "rgba(54, 162, 235, 0.4",
            borderColor: "rgb(54, 162, 235)",
          },
          {
            label: "Products sold",
            data: productsPerMonth,
            borderWidth: 1,
            backgroundColor: "rgba(75, 192, 192, 0.4)",
            borderColor: "rgb(75, 192, 192)",
          },
        ],
      },
      options: {
        scales: {
            y: {
              beginAtZero: true,
            },
          },
      },
    });



    }
})




 // customChartData("none");

    function customChartData(data){
      $.ajax({
        url:"/admin/chart/"+data,
        method:"get",
        success:(res)=>{

          inTransit = res.data.inTransit;
     cancelled = res.data.cancelled;
     delivered = res.data.delivered;
     returned = res.data.returned;
     chart.data.datasets[0].data=[inTransit, delivered, cancelled , returned ];

          chart.update()
       
        }
      })
    
    }


    // $("#dateSubmitBtn").click(()=>{
    //   $('#datemodal').modal('toggle')

    // })


    function TDate() {
      
      var UserDate = document.getElementById("todate").value;
      var ToDate = new Date();
      console.log(new Date(UserDate).getTime() )
      console.log(ToDate.getTime())
      if (new Date(UserDate).getTime() > ToDate.getTime()) {
        console.log("hjfhj")
        $("#todate").val("")
            alert("The Date must be Bigger or Equal to today date");
            return false;
       }
      return true;
  
  }
