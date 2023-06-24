function removeFromCart(productID) {
    console.log(productID)
    $.ajax({
        url:`/users/cart?id=${productID}`,
        method:"delete",
        success: (res) => {
            if (res.success === "removed") {
              $("#cart").load(location.href + " #cart");
              Swal.fire({
                toast: true,
                icon: "error",
                position: "top-right",
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                animation: true,
                title: "Removed from cart",
              });
            }
          },
    })
  }

function changeCount(productID, i,count) {
    $.ajax({
      url: "/users/cart",
      method: "put",
      data: { id: productID,count:count },
      success: (res) => {
        if(res.data.currentProduct.quantity===0){
             $("#cart").load(location.href + " #cart");
        }else{
         $(`#cartCount${i}`).html(res.data.currentProduct.quantity);
        $(`#totalItems`).html(res.data.userCart.totalQuantity);
        $(`#totalPrice`).html("₹ " + res.data.userCart.totalPrice);
        }
        
        
      },
    });
  }

function reduceCount(productID, i,count) {
    
    $.ajax({
      url: "/users/cart/count",
      method: "delete",
      data: { id: productID },
      success: (res) => {
        
        $(`#cartCount${i}`).html(res.data.currentProduct.quantity);
        $(`#totalItems`).html(res.data.userCart.totalQuantity);
        $(`#totalPrice`).html("₹ " + res.data.userCart.totalPrice);
      },
    });
  }