const bcrypt=require("bcrypt");
const userDetails=require("../../models/user/details")


exports.signInPage =async (req, res) => {
    try {
      if (req.session.userID) {
        res.redirect("/");
      } else {
        res.render("user/partials/signIn", {
          documentTitle: "User Sign In | SHOE ZONE",
          session: null,
        });
      }
    } catch (error) {
      console.log("Error rendering user signin page: " + error);
    }
  };

  exports.verifyUser = async (req, res) => {
    try{
         const inputEmail=req.body.email;
         const inputPassword=req.body.password;
         const user=await userDetails.findOne({email:inputEmail})
         if(user){
            const hashedCheck= await bcrypt.compare(inputPassword,user.password)
            if(user.access==true){
                if (hashedCheck) {
                    req.session.userID = user._id;
                
                    
                      res.redirect("back");
                    
                    

                  } else {
                    res.render("user/partials/signIn", {
                      documentTitle: "User Sign In | SHOE ZONE",
                      errorMessage: "Incorrect Password",
                    });
                  }
            }
         }
    }
    catch(error){
        console.log("Error on signIn: " + error); 
    }


  }



  