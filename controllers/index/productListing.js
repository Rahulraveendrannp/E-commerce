const userCollection=require("../../models/user/details");
const productCollection=require("../../models/admin/product");
const categoryCollection=require("../../models/admin/category");

exports.ourCollection=async(req,res)=>{
    try{
        let collectionId=req.query.category;       
        let listing=req.session.listing;
        let currentUser=null;
        if(req.session.userID){
          currentUser= await userCollection.findOne({_id:req.session.userID})
        }
        listingName="Our Collection";
        if(collectionId=='collection' && !req.session.sorted && !req.session.filter && !req.session.searched){
          listing= await productCollection.find({listed:true}).populate("brand").limit(9);
          req.session.listing=listing;
          
        }
        else if(collectionId=='moreCollection' && !req.session.sorted && !req.session.filter && !req.session.searched){
          listing= await productCollection.find({listed:true}).populate("brand");
          req.session.listing=listing;
        }
        req.session.sorted=null;
        req.session.filter=null;
        req.session.searched=null;

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
            case 'Sports': 
                currentFilter = allProducts.filter(
                (product) => product.subCategory == "Sports"
              );
              break;
            case 'Casual': 
                 currentFilter = allProducts.filter(
                  (product) => product.subCategory == "Casual"
                );
                break;
            case 'Formal': 
                    currentFilter = allProducts.filter(
                    (product) => product.subCategory == "Formal"
                  );
                  break;
            case "none":
                    currentFilter = allProducts.slice(0,9);
                    searchClear=1;
                    break;
            default :
                    currentFilter = null;
                    console.log("default switch case of filter");
                    
        }

     req.session.listing = currentFilter;
     req.session.filtered = currentFilter;
     req.session.filter = 1;
    if (!currentFilter && !searchClear) {
        res.json({
          success: 0,
        });
      } else if( searchClear) {
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
            req.session.sorted = 1;
            res.json({
                sorted:1
              });
        }
        else if(req.body.sortBy==='descending'){
           
            listing=listing.sort((a,b)=> b.price-a.price );
            req.session.listing=listing;
            req.session.sorted = 1;
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
            req.session.listing=listing;
            req.session.sorted = 1;
            res.json({
                sorted:1
              });

        }
        req.session.sortBy = listing
    

    }catch(error){
        res.redirect('/products')
        console.log("Error on sorting: " + error); 
    }
}

exports.search=async(req,res)=>{
    try{
        let searchResult=[];
        let searchInput=req.body.searchInput;
        if(req.session.filtered ){
            const regex=new RegExp(searchInput,'i');
            req.session.filtered.forEach(element => {
                if(regex.exec(element.name)){
                    searchResult.push(element);
                }
            });
        }
       else if(req.session.sortBy){
          const regex=new RegExp(searchInput,'i');
          req.session.sortBy.forEach(element => {
              if(regex.exec(element.name)){
                  searchResult.push(element);
              }
          });
      }
      else{
            searchResult=await productCollection.find({
                name:{$regex:searchInput,$options:'i'},listed:true
            })
        }
        req.session.searched=1
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
  let currentUser=null

  if(req.session.userID){
    currentUser= await userCollection.findOne({_id:req.session.userID})
  }
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
        session:req.session.userID,
        currentUser
      });
    }
    }
    catch(error){
        res.redirect('/products')
        console.log("Error categorizing in products page: " + error);
    }
}
