$.ajax({
    url: "/admin/dashboard",
    method: "PUT",
    success : (res)=>{
        let orderData=res.data.orderData;
        let totalOrders = [0,0,0,0,0];
        let revenuePerMonth = [0,0,0,0,0];
        let avgBillPerOrder = [0,0,0,0,0];
        let productsPerMonth = [0,0,0,0,0];
    orderData.forEach(order => {
        totalOrders.push(order.totalOrders);
        revenuePerMonth.push(order.revenue);
        avgBillPerOrder.push(order.avgBillPerOrder);
        productsPerMonth.push(order.totalProducts);
        
    });
   
    const monthDetails=["Jan", "Feb", "Mar","Apr","May","Jun","Jul", "Aug","Sep", "Oct",  "Nov","Dec",];
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

    const inTransit = res.data.inTransit;
    const cancelled = res.data.cancelled;
    const delivered = res.data.delivered;
    const returned = res.data.returned;

    const ctz = document.getElementById("myChart3");
    new Chart(ctz, {
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
      options: {
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
        },
      },
    });

    const cty = document.getElementById("myChart2");
    console.log(totalOrders)
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