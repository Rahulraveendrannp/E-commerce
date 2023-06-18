const adminDetails=require("../../models/admin/details");
const bcrypt=require("bcrypt")


exports.page = (req, res) => {
    try {
      res.render("admin/partials/signIn", {
        documentTitle: "Admin Sign In",
      });
    } catch (error) {
      console.log("Error rendering admin signin Page: " + error);
    }
  };
exports.verification = async(req,res)=>{

    try{
        const email=req.body.email.toLowerCase();
        const password=req.body.password;
        const admin= await adminDetails.findOne({email:email})
        if(admin){
              const hashCheck= await bcrypt.compare(password,admin.password);
        
        if(hashCheck){
          req.session.admin = req.body.email;
            console.log("admin success");
             res.redirect('/admin/dashboard');
        }else{

            res.render("admin/partials/signIn", {
                documentTitle: "Admin Sign In | SHOE ZONE",
                errorMessage: "Incorrect Password",
              });
        }
    }else{
        res.render("admin/partials/signIn", {
            documentTitle: "Admin Sign In | SHOE ZONE",
            errorMessage: "Admin not found",
          });

    }


    }catch(error){

console.log("erroe on admin signin"+error);

    }

}
  