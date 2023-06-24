const signOut=async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect("/");
      } catch (error) {
        res.redirect("/");
        console.log("Error signing out user: " + error);
      }
}

module.exports = signOut