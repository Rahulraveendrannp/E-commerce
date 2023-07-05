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
    let form=e.target.form;
    let formData=$("#formID").serialize()
  const chekcedVal=$(".form-check-input:checked").val();
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
            if(chekcedVal=="RazorPay"){
                $.ajax({
                    url:"/users/cart/checkout",
                    method:"post",
                    data:formData,
                    success: (res)=>{
                        console.log(res)
                        var options = {
                            "key": res.key, // Enter the Key ID generated from the Dashboard
                           
                            "name": "SHOE ZONE", //your business name
                            "description": "Complete Your Payment",
                            "image": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=398&q=80",
                            "order_id":res.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                            "callback_url": `/users/cart/checkout/${res.transactionID}`,
                            "theme": {
                                "color": "#3399cc"
                            }
                        };
                        var rzp1 = new Razorpay(options);
                        
                            rzp1.open();
                            
                        

                    }
                })

            }else{
                form.submit()
            }
            
                
        }
    })
}