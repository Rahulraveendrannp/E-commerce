const userCollection=require("../../models/user/details");
const productCollection=require("../../models/admin/product");
const categoryCollection=require("../../models/admin/category");

exports.ourCollection=async(req,res)=>{
    try{
        let collectionId=req.query.category;
        console.log(collectionId);
        let listing=req.session.listing;
        let currentUser=null;
        if(req.session.userID){
          currentUser= await userCollection.findOne({_id:userID})
        }
        listingName="Our Collection"
        if(!listing || (collectionId=='collection')){ 
            listing= await productCollection.find({listed:true}).populate("brand")
        }

        res.render("index/productListing",{
            session:req.session.userID,
            listingName,
            listing,
            currentUser,
            documentTitle: "Shoe Zone"
        })
    }catch(error){
        res.redirect('/products')
        console.log("Error rendering our collection page: " + error);
    }
}

exports.filter=async(req,res)=>{
    try{

        let allProducts= await productCollection.find({listed:true}).populate("category").populate("brand")
        let currentFilter
        let searchClear
        switch(req.body.filterBy){
            case 'men': 
                currentFilter = allProducts.filter(
                (product) => product.category.name == "men"
              );
              break;
            case 'women': 
                 currentFilter = allProducts.filter(
                  (product) => product.category.name == "women"
                );
                break;
            case 'kids': 
                    currentFilter = allProducts.filter(
                    (product) => product.category.name == "kids"
                  );
                  break;
            case "none":
                    currentFilter = null;
                    searchClear=1;
                    break;
            default :
                    currentFilter = null;
                    console.log("default switch case of filter");
                    
        }

     req.session.listing = currentFilter;
     req.session.filtered = currentFilter;
    if (!currentFilter && !searchClear) {
        res.json({
          success: 0,
        });
      } else if( !currentFilter && searchClear) {
        res.json({
          success: "clear",
        });}
        else {
            res.json({
                success: 1,
              });
        }
      
    

    }
    catch(error){
        res.redirect('/products')
        console.log("Error on filtering: " + error);
    }
}

exports.sortBy = async (req, res) => {
    try{
        if(!req.session.listing){
            req.session.listing=await productCollection.find({listed:true}).populate("brand")
        }
        let listing=req.session.listing;
        if(req.body.sortBy==='ascending'){
        
            listing= listing.sort((a,b)=> a.price-b.price );
            req.session.listing=listing;
            res.json({
                sorted:1
              });
        }
        else if(req.body.sortBy==='descending'){
           
            listing=listing.sort((a,b)=> b.price-a.price );
            req.session.listing=listing;
            res.json({
                sorted:1
              });
        }
        else if(req.body.sortBy==='newReleases'){
            listing=listing.sort((a,b)=> {
                const id1 = a._id.toString();
                const id2 = b._id.toString();
                if (id1 < id2) {
                return 1;
                  }
                if (id1 > id2) {
                 return -1;
                  }
                return 0;
            } );
            req.session.listing=listing
            res.json({
                sorted:1
              });

        }
    

    }catch(error){
        res.redirect('/products')
        console.log("Error on sorting: " + error); 
    }
}

exports.search=async(req,res)=>{
    try{
        let searchResult=[];
        let searchInput=req.body.searchInput;
        if(req.body.filtered){
            const regex=new RegExp(searchInput,'i');
            req.session.filtered.forEach(element => {
                if(regex.exec(element.name)){
                    searchResult.push(element);
                }
            });
        }else{
            searchResult=await productCollection.find({
                name:{$regex:searchInput,$options:'i'},listed:true
            })
        }
        req.session.listing=searchResult;
        res.json({
            success: 1,
          });

    }catch(error){
        res.redirect('/products')
        console.log("Error on searching: " + error); 
    }
}

exports.categories=async(req,res)=>{
    try{
  let category=req.query.category;
  let listing;
    if (category== "newReleases") {
      
        listing = await productCollection.find().sort({ _id: -1 });
      
      res.render("index/productListing", {
        listing: listing,
        documentTitle: `New Releases | SHOE ZONE`,
        listingName: "New Releases",
      });
    } else {
      const currentCategory = await categoryCollection.find({name:category});
        listing = await productCollection.find({
          category: currentCategory[0]._id,
          listed: true,
        }).populate('brand')
      req.session.listing=listing;
      res.render("index/productListing", {
        listing: req.session.listing,
        documentTitle: `${currentCategory[0].name} | SHOE ZONE`,
        listingName: currentCategory[0].name,
      });
    }
    }
    catch(error){
        res.redirect('/products')
        console.log("Error categorizing in products page: " + error);
    }
}
