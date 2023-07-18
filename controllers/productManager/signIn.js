const productManagerDetails=require("../../models/productManager/details")
exports.page=async(req,res)=>{
    try{
        res.render("productManager/partials/signIn", {
            documentTitle: "productManager Sign In",
          })

    }catch(error){
        console.log("error on rendering signIn page")
    }
}

exports.verification = async(req,res)=>{

    try{
        const email=req.body.email.toLowerCase();
        const password=req.body.password;
        const productManager= await productManagerDetails.findOne({email:email})
        if(productManager){ 
            if(productManager.access== true){

                if(password==productManager.password){
                    req.session.productManager = req.body.email;
                      console.log("productManager success");
                       res.redirect('/productManager/products');
                  }else{
          
                      res.render("productManager/partials/signIn", {
                          documentTitle: "ProductManager Sign In | SHOE ZONE",
                          errorMessage: "Incorrect Password",
                        });
                  }

            }else{
                res.render("productManager/partials/signIn", {
                    documentTitle: "ProductManager Sign In | SHOE ZONE",
                    errorMessage: "Your Acount is Blocked",
                  })

            }
        
       
    }else{
        res.render("productManager/partials/signIn", {
            documentTitle: "ProductManager Sign In | SHOE ZONE",
            errorMessage: "ProductManager not found",
          });

    }


    }catch(error){

console.log("error on productManager signin"+error);

    }

}