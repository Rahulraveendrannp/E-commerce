function addToWishlist(productId){
    $.ajax({
        url:"/users/wishlist",
        method:"patch",
        data:{
            id:productId
        },
        success:(res)=>{
            if (res.data.added === 0) {
                $("#wishlistHeart").html('<i class="fa fa-heart text-white">');
                Swal.fire({
                  toast: true,
                  icon: "error",
                  position: "top-right",
                  showConfirmButton: false,
                  timer: 1000,
                  timerProgressBar: true,
                  animation: true,
                  title: "Removed from wishlist",
                });
              } else if (res.data.added === 1) {
                $("#wishlistHeart").html('<i class="fa fa-heart text-danger">');
                Swal.fire({
                  toast: true,
                  icon: "success",
                  position: "top-right",
                  showConfirmButton: false,
                  timer: 1000,
                  timerProgressBar: true,
                  animation: true,
                  title: "Added to wishlist",
                });
              } else {
                window.location.href = "/users/signIn";
              }

        }
    })
}
function addToCart(productID) {
    $.ajax({
      url: "/users/cart",
      method: "post",
      data: {
        id: productID,
      },
      success: (res) => {
        if (res.success == "countAdded") {
          Swal.fire({
            toast: true,
            icon: "success",
            position: "top-right",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            animation: true,
            title: "Count added in cart",
          });
        } else if (res.success == "addedToCart") {
          Swal.fire({
            toast: true,
            icon: "success",
            position: "top-right",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            animation: true,
            title: "Added to cart",
          });
        } else {
          window.location.href = "/users/signIn";
        }
      },
    });
  }