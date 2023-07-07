const productManagerCollection=require("../../models/productManager/details");
const nodemailer=require("nodemailer");

exports.viewAll=async(req,res)=>{
    try{
        const allManagers = await productManagerCollection.find().sort({ name: -1 });
    res.render("admin/partials/productManager", {
      session: req.session.admin,
      allManagers,
      documentTitle: "Customer Management | SHOE ZONE",
    })

    }catch(error){
        console.log("error on showing productManagers"+error)
    }
}

exports.addNew=async(req,res)=>{
    try{
        const newManager= new productManagerCollection(req.body);
        await newManager.save();
 // Transporter
       const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user:process.env.TRANSPORTER_USERNAME,
            pass: process.env.TRANSPORTER_PASSWORD
        }
    });

      // Mail options
     const mailOptions =  {
        from:process.env.TRANSPORTER_USERNAME,
        to:req.body.email,
        subject: " SHOE ZONE eCommerce",
        html: `<h1>Congrats </h1></br><h2 style="text-color: red, font-weight: bold">YOUR HAVE BEEN ADDED AS PRODUCT MANGER WITH </br>Default Password: ${req.body.password}</h2></br><p>Chnage password :</p>`,
      };

      // Send mail
       transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
          console.log("mesaging sending error"+error);
        }else{
          console.log("message send to user email ");
        }
      });
         res.redirect("/admin/productManager_management");

    }catch(error){
        console.log("error on adding new manager :"+error)
    }
}

exports.update=async(req,res)=>{
    try{
        let currentAccess = req.body.currentAccess === "true";
        currentAccess = !currentAccess
        await productManagerCollection.findByIdAndUpdate(req.body.managerID, {
          access: currentAccess,
        });
        res.json({
          data: { newAccess: currentAccess },
        });

    }catch(error){
        console.log("error on updating manager")
    }
}

exports.delete=async(req,res)=>{
    try{
        await productManagerCollection.deleteOne({_id:req.params.id})
        res.json({delete:"success"})

    }catch(error){
        console.log("error on deleting manager")
    }
}
