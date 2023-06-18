const categoryDetails=require("../../models/admin/category");



exports.list= async(req,res)=>{

    try {
        const categories = await categoryDetails.find({});
        res.render("admin/partials/categories", {
          session: req.session.admin,
          documentTitle: "Category Management | SHOE ZONE",
          details: categories,
        });
      } catch (error) {
        console.log("Error rendering all catergories: " + error);
      }

}

exports.addCategory = async(req,res)=>{

    try{
        let inputCategory=req.body.category
        inputCategory=inputCategory.toLowerCase();
        const categories= await categoryDetails.find({});
        const categoryCheck= await categoryDetails.findOne({name:inputCategory});
        if(categoryCheck){
            res.render("admin/partials/categories", {
                documentTitle: "Category Management | SHOE ZONE",
                details: categories,
                errorMessage: "Category Already existing.",
              });
        }else{
            const newCategory= new categoryDetails({
                name:inputCategory
            })
            await newCategory.save();
        res.redirect("/admin/categories");
        }

    }
    catch (error) {
        console.log("Error adding new category: " + error);
      }
}

exports.deleteCategory= async(req,res)=>{
    try{
        const categoryId = req.query.id;
        const deleteUser = await categoryDetails.deleteOne({_id:categoryId});
        res.redirect("/admin/categories");
    }
    catch(error){
        console.log("Error deleting category: " + error)
    }
}

exports.editCategoryPage= async(req,res)=>{
    try{
        const categoryId = req.query.id;
        const currentCategory= await categoryDetails.findOne({_id:categoryId});
        req.session.currentCategory = currentCategory;
        res.render("admin/partials/editCategory",{
            session:req.session.admin,
            documentTitle: "Edit Category | SHOE ZONE",
            category: currentCategory,
        })
       
    }
    catch(error){
        console.log("Error GET category Page: " + error)
    }
}
exports.editCategory=async(req,res) =>{
    try{
        const currentCategory=req.session.currentCategory;
        let newCategory=req.body.name;
        newCategory=newCategory.toLowerCase();
        const duplicateCategory= await categoryDetails.findOne({name:newCategory})
        if(duplicateCategory){
            res.render("admin/partials/editCategory",{
                session:req.session.admin,
                documentTitle: "Edit Category | SHOE ZONE",
                errorMessage: "Duplication of categories not allowed",
                category: currentCategory,
            })

        }else{
            console.log(currentCategory);
            await categoryDetails.updateOne({_id:currentCategory._id},{$set:{name:newCategory}})
            res.redirect("/admin/categories")
        }

    }
    catch(error){
        console.log("Error POST edit category Page: " + error);
    }
}