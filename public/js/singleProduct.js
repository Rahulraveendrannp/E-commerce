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
          $("#cartCount").load(location.href + " #cartCount");
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
          $("#cartCount").load(location.href + " #cartCount");
        }else if(res.success === "outofstcok" ){
          Swal.fire({
            toast: true,
            icon: "error",
            position: "top-right",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            animation: true,
            title: "Out Of Stock",
          });
        }
         else {
          window.location.href = "/users/signIn";
        }
      },
    });
  }

  function reviewAdd(productId) {
    Swal.fire({
      showCloseButton: true,
      showConfirmButton: true,
      background: 'black' ,
      html: `<form id="reviewForm" >
  <div class="mb-3">
    <label for="review" class="form-label">Post a review</label>
    <input name="review" class="form-control" id="review" pattern="^[a-zA-Z0-9\s\.,!?']{10,100}$" required title="Please enter a valid review" >
  </div>
 
  <div class="mb-3">
    <div class="review-star">
      <input type="checkbox" name="rating" id="st1" value="5" />
      <label for="st1"></label>
      <input type="checkbox" name="rating" id="st2" value="4" />
      <label for="st2"></label>
      <input type="checkbox" name="rating" id="st3" value="3" />
      <label for="st3"></label>
      <input type="checkbox" name="rating" id="st4" value="2" />
      <label for="st4"></label>
      <input type="checkbox" name="rating" id="st5" value="1" />
      <label for="st5"></label>
    </div>
  </div>
  </form>`,
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `/users/reviews?productID=${productId}`,
          method: "post",
          data: $("#reviewForm").serialize(),
          success: (res) => {
            $("section").load(location.href + " section");
            $("#addReview").hide();
          },
        });
      }
    });
  }

function helpful(id) {
    $.ajax({
      url: "/users/reviews",
      method: "patch",
      data: {
        reviewID: id,
      },
      success: (res) => {
        if (res.success == 1) {
          $("#helpful" + id).load(location.href + " #helpful" + id);
        } else {
          window.location.replace("/users/signIn");
        }
      },
    });
  }
  
  function buyNow(productID) {
    $.ajax({
      url: "/users/cart",
      method: "post",
      data: {
        id: productID,
      },
      success: (res) => {
        if (res.success === "addedToCart" || res.success === "countAdded") {
          window.location.href = "/users/cart";
        }
        else if(res.success === "outofstcok" ){
          Swal.fire({
            toast: true,
            icon: "error",
            position: "top-right",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            animation: true,
            title: "Out Of Stock",
          });
        }
         else {
          window.location.href = "/users/signIn";
        }
      },
    });
  }