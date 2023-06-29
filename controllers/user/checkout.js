const { default: mongoose } = require("mongoose");
const cartCollection=require("../../models/user/cart");
const userCollection=require("../../models/user/details");
const couponCollection=require("../../models/admin/coupons");
const paypal=require("paypal-rest-sdk");
const orderCollection=require("../../models/user/orders");



exports.viewPage=async(req,res)=>{
    try{
        
        const userCart=await cartCollection.findOne({customer:req.session.userID}).populate("products.name");
        const products=userCart.products;
     if(userCart.totalQuantity != 0){
        let allAddresses=await userCollection.findById(req.session.userID);
        allAddresses=allAddresses.addresses;
        let defaultAddress=await userCollection.aggregate([
            {$match:{_id:new mongoose.Types.ObjectId(req.session.userID)}},
            {$unwind:"$addresses"},
            {$match:{"addresses.primary":true}}
        ]);
        if (defaultAddress != "") {
            defaultAddress = defaultAddress[0].addresses;
          } else {
            defaultAddress = 0;
          }

        res.render("user/profile/partials/checkout", {
            defaultAddress,
            products,
            userCart,
            allAddresses,
            documentTitle: "Checkout | SHOE ZONE",
          });}else {
            res.redirect("/users/cart");
          }

    }catch(error){
        res.redirect("/users/cart");
         console.log('error on rendering checkoutpage :'+error)
    }
}

exports.defaultAddress=async(req,res)=>{
    try{

        const userID = req.session.userID;
    const DefaultAddress = req.body.DefaultAddress;
    await userCollection.updateMany(
      { _id: userID, "addresses.primary": true },
      { $set: { "addresses.$.primary": false } }
    );
    await userCollection.updateOne(
      { _id: userID, "addresses._id": DefaultAddress },
      { $set: { "addresses.$.primary": true } }
    );
        res.redirect("/users/cart/checkout");

    }catch(error){
        res.redirect("/users/cart/checkout");
        console.log("error on changing to deafultaddress :"+error)

    }
}

exports.couponCheck=async(req,res)=>{
  try{
    const couponCode=req.body.couponCode;
    const userCart= await cartCollection.findOne({
      customer:req.session.userID
    });
    const cartPrice= userCart.totalPrice;
    if(couponCode==''){

      res.json({
        data: {
          couponCheck: null,
          discountPrice: 0,
          discountPercentage: 0,
          finalPrice: userCart.totalPrice,
        },
      });
    }else{
       const coupon=await couponCollection.findOne({code:couponCode});
       let discountPercentage = 0;
      let discountPrice = 0;
      let finalPrice = cartPrice;
      if(coupon){
        const alreadyUsedCoupon= await userCollection.findOne({
          _id: req.session.userID,
          couponsUsed: coupon._id,
        });
        if(!alreadyUsedCoupon){
          if (coupon.active == true) {
            const currentTime=new Date().toJSON();
            if(currentTime > coupon.startingDate.toJSON()){
              if(currentTime < coupon.expiryDate.toJSON()){
                discountPercentage = coupon.discount;
                discountPrice = (discountPercentage / 100) * cartPrice;
                discountPrice = Math.floor(discountPrice)
                finalPrice = cartPrice - discountPrice;

                couponCheck =
                  '<b>Coupon Applied <i class="fa fa-check text-success" aria-hidden="true"></i></b></br>' +
                  coupon.name;

              }else{
                couponCheck= "<b style='font-size:0.75rem; color: red'>Coupon expired<i class='fa fa-stopwatch'></i></b>";
              }

            }else{
              couponCheck = `<b style='font-size:0.75rem; color: green'>Coupon starts on </b><br/><p style="font-size:0.75rem;">${coupon.startingDate}</p>`;
            }

          }else{
            couponCheck = "<b style='font-size:0.75rem;color: red'>Invalid Coupon !</b>";
          }

        }else{
          couponCheck = "<b style='font-size:0.75rem;color: red'>Coupon already used !</b>";
        }

      }else{
        couponCheck = "<b style='font-size:0.75rem;color: red'>Coupon not found</b>";
      }
      res.json({
        data: {
          couponCheck,
          discountPrice,
          discountPercentage,
          finalPrice,
        },
      });
    }

    }catch(error){
      
      console.log("error on coupon check :"+error)
  }

  }

  exports.checkout=async(req,res)=>{
    try{
    //Shipping Address
      let shippingAddress= await userCollection.aggregate([
        {
          $match:{_id: new mongoose.Types.ObjectId(req.session.userID)}
        },{
          $unwind:"$addresses"
        },{
          $match:{"addresses._id":new mongoose.Types.ObjectId(req.body.addressID)}
        }
      ]);
      shippingAddress = shippingAddress[0].addresses;
    // Coupon used
      couponUsed= await couponCollection.findOne({
        code:req.body.couponCode,
        active:true,
      })
      
    if(couponUsed){
      const currentTime= new Date().toJSON();
      if(currentTime > couponUsed.startingDate.toJSON()){
        if(currentTime < couponUsed.expiryDate.toJSON()){
          couponUsed=couponUsed._id;
        }else{
          req.body.couponDiscount = 0;
        }
      }else{
        req.body.couponDiscount = 0;
      }
    }else{
      req.body.couponDiscount = 0;
    }
    if (!req.body.couponDiscount) {
      req.body.couponDiscount = 0;
      couponUsed = null;
    };
    req.session.couponUsed=couponUsed;

    //cart summary

    const orderSummary=await cartCollection.aggregate([
      {
        $match:{customer:new mongoose.Types.ObjectId(req.session.userID)}
      },{
        $unwind:"$products"
      },{
        $project:{
          _id:0,
          product:"$products.name",
          quantity:"$products.quantity",
          totalPrice:"$products.price",
        }
      }
    ]);
    const userCart=  await cartCollection.findOne({customer:req.session.userID});

    //creating order details

    let orderDetails={
      customer:req.session.userID,
      shippingAddress:{
        building: shippingAddress.building,
        address: shippingAddress.address,
        pincode: shippingAddress.pincode,
        country: shippingAddress.country,
        contactNumber: shippingAddress.contactNumber,
      },
      modeOfPayment:req.body.paymentMethod,
      couponUsed:couponUsed,
      summary:orderSummary,
      totalQuantity: userCart.totalQuantity,
      price: userCart.totalPrice,
      finalPrice: req.body.finalPrice,
      discountPrice: req.body.couponDiscount,
    };
    req.session.orderDetails=orderDetails;
    const transactionID = Math.floor(
      Math.random() * (1000000000000 - 10000000000) + 10000000000
    );
    req.session.transactionID=transactionID;

    if(req.body.paymentMethod==='COD'){
      res.redirect("/users/cart/checkout/" + transactionID);
    }else if(req.body.paymentMethod === "PayPal"){
      let billAmount = orderDetails.finalPrice * 0.012; 
      billAmount=billAmount.toFixed(2)
      console.log(billAmount)
      paypal.configure({
        mode: 'sandbox', //sandbox or live
        client_id: process.env.Client_ID,
        client_secret: process.env.Secret_key
      });
      const create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal"
        },
        redirect_urls: {
            return_url: `http://localhost:3001/users/cart/checkout/${transactionID}`,
            cancel_url: "http://localhost:3001/users/cart/checkout"
        },
        transactions: [{
            item_list: {
                items: [{
                  name: `Order Number-${transactionID}`,
                  sku: `Order Number-${transactionID}`,
                    price: billAmount,
                    currency: "USD",
                    quantity: 1
                }]
            },
            amount: {
                currency: "USD",
                total: billAmount
            },
            description: "SHOE ZONE E-Commerce"
        }]
    };
    paypal.payment.create(
      create_payment_json,
      async function (error, payment) {
        if (error) {

          console.log("payment page error :"+error);
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              res.redirect(payment.links[i].href);
            }
          }
        }
      }
    );

    }

    }catch(error){
      console.log("error on checkout :"+error)
    }
  }

  exports.result=async(req,res)=>{
    try{
      if(req.session.transactionID){
        const couponUsed=req.session.couponUsed;
        req.session.transactionID=false;
        const orderDetails= new orderCollection(req.session.orderDetails)
        await orderDetails.save();
        if(couponUsed){
          await userCollection.findByIdAndUpdate(req.session.userID,{
            $push:{
              orders:orderDetails._id,
              couponsUsed : couponUsed
            }
          })
        }else{
          await userCollection.findByIdAndUpdate(req.session.userID,{
            $push:{
              orders:orderDetails._id
            }
          })
        }
        await cartCollection.findOneAndUpdate({
          customer:req.session.userID
        },{
          $set:{products: [], totalPrice: 0, totalQuantity: 0 }
        });
        const orderResult = "Order Placed";
      res.render("user/profile/partials/orderResult", {
        documentTitle: orderResult,
        orderID: orderDetails._id,
      });

      }else {
        res.redirect("/users/cart/checkout");
      }

    }catch(error){
      console.log("error on rendering success page :" +error)
    }
  }
