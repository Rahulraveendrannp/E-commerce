function checkCoupon(e){
    e.preventDefault()


$.ajax({
    url: "/users/cart/checkout",
    method: "put",
    data: {
        couponCode: $("#couponCode").val(),
      },
      success:(res)=>{
      $("#couponMessage").html(res.data.couponCheck);
      $("#couponDiscount").html(res.data.discountPrice);
      $("#inputCouponDiscount").val(res.data.discountPrice);
      $("#finalPrice").html(res.data.finalPrice);
      $("#inputFinalPrice").val(res.data.finalPrice);
      }
})

}

function payment(e){
    e.preventDefault()
    let form=e.target.form
    Swal.fire({
        icon: 'question',
        title:"<h5 style=color='white'>"+ `Proceed to Payment?`+"</h5>",
        showCancelButton: true,
        background:'#19191a',
          iconColor:'blue',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result)=>{
        if(result.value){
            console.log("dbd")
            form.submit()
                
        }
    })
}