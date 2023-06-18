const userDetails=require("../../models/user/details")

exports.viewAll = async (req, res) => {
  try {
    let  currentUser
    if (req.session.userID) {
     currentUser = await userDetails.findById(req.session.userID);
    }
   let banners=null
   let newReleases=null
   let men=[]
   let women=[]
  

    res.render("index/landingPage", {
      session: req.session.userID,
      currentUser,
      newReleases,
      men,
      women,
      banners,
    });
  
  } catch (error) {
    console.log("Error rendering landing page: " + error);
  }
};
