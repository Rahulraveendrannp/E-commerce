const brandDetails=require("../../models/admin/brand");



exports.list= async(req,res)=>{

    try {
        const brands = await brandDetails.find({});
        res.render("admin/partials/brands", {
          session: req.session.admin,
          documentTitle: "Brand Management | SHOE ZONE",
          details: brands,
        });
      } catch (error) {
        console.log("Error rendering all brands: " + error);
      }

}

exports.addBrand = async(req,res)=>{

    try{
        let inputBrand=req.body.brand
        inputBrand=inputBrand.toLowerCase();
        const brands= await brandDetails.find({});
        const brandCheck= await brandDetails.findOne({name:inputBrand});
        if(brandCheck){
            res.render("admin/partials/brands", {
                documentTitle: "brand Management | SHOE ZONE",
                details: brands,
                errorMessage: "Brand Already existing.",
              });
        }else{
            const newBrand= new brandDetails({
                name:inputBrand
            })
            await newBrand.save();
        res.redirect("/admin/brands");
        }

    }
    catch (error) {
        console.log("Error adding new brand: " + error);
      }
}

exports.deleteCategory= async(req,res)=>{
    try{
        const brandId = req.query.id;
        const deleteBrand = await brandDetails.deleteOne({_id:brandId});
        res.redirect("/admin/brands");
    }
    catch(error){
        console.log("Error deleting brand: " + error)
    }
}

exports.editBrandPage= async(req,res)=>{
    try{
        const brandId = req.query.id;
        const currentBrand= await brandDetails.findOne({_id:brandId});
        req.session.currentBrand = currentBrand;
        res.render("admin/partials/editBrand",{
            session:req.session.admin,
            documentTitle: "Edit Brand | SHOE ZONE",
            brand: currentBrand,
        })
       
    }
    catch(error){
        console.log("Error GET brand Page: " + error)
    }
}
exports.editBrand=async(req,res) =>{
    try{
        const currentBrand=req.session.currentBrand;
        let newBrand=req.body.name;
        newBrand=newBrand.toLowerCase();
        const duplicateBrand= await brandDetails.findOne({name:newBrand})
        if(duplicateBrand){
            res.render("admin/partials/editBrand",{
                session:req.session.admin,
                documentTitle: "Edit Brand | SHOE ZONE",
                errorMessage: "This Brand Name Already Exist!",
                brand: currentBrand,
            })

        }else{
            console.log(currentBrand);
            await brandDetails.updateOne({_id:currentBrand._id},{$set:{name:newBrand}})
            res.redirect("/admin/brands")
        }

    }
    catch(error){
        console.log("Error POST edit brand Page: " + error);
    }
}