const offerCollection=require("../../models/admin/offer");
const categoryCollection=require("../../models/admin/category");
const moment=require("moment");

exports.viewPage=async(req,res)=>{
    try{
        const offers = await offerCollection.find().populate("category");
        const categories=await categoryCollection.find();

        res.render("admin/partials/offers", {
            session: req.session.admin,
            documentTitle: "Offer Management",
            offers,
            moment,
            categories
          });
    }catch(error){
        res.redirect("/admin/dashboard")
        console.log("error on rending offer page :"+error)
    }
}

exports.addNew=async(req,res)=>{
    try{
        await offerCollection.create(req.body);
      res.redirect("/admin/offers");

    }catch(error){
        res.redirect("/admin/dashboard")
        console.log("error on adding new offer :"+error)
    }
}

exports.delete=async(req,res)=>{
    try{

        await offerCollection.findByIdAndDelete(req.query.id);
        res.redirect("/admin/offers")

    }catch(error){
        console.log("error on deleting offfer :"+error)
    }
}


