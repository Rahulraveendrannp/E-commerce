
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
              const hashCheck= await bcrypt.compare(password,productManager.password);
        
        if(hashCheck){
          req.session.productManager = req.body.email;
            console.log("productManager success");
             res.redirect('/productManager/dashboard');
        }else{

            res.render("productManager/partials/signIn", {
                documentTitle: "ProductManager Sign In | SHOE ZONE",
                errorMessage: "Incorrect Password",
              });
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