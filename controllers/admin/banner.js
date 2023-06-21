const bannerCollection=require("../../models/admin/banner");
const sharp=require("sharp");

exports.viewall=async(req,res)=>{
    try{
        const allBanners = await bannerCollection.find().sort({ _id: -1 });
    res.render("admin/partials/banner", {
      session: req.session.admin,
      allBanners,
      documentTitle: "Banner Management | SHOE ZONE",
    });

    }catch(error){
        console.log("banner page rendering error" +error);
        res.redirect("/admin");
    }
}
exports.addBanner=async(req,res)=>{
    try{
        if(req.file){
             let bannerImage=`${req.body.title}_${Date.now()}.png`;
             sharp(req.file.buffer)
               .toFormat("png")
               .png({ quality: 100 })
               .toFile(`public/image/banners/${bannerImage}`);

            req.body.image=bannerImage
            const newBanner=new bannerCollection(req.body);
            await newBanner.save();
            res.redirect("/admin/banner_management")
        }

    }catch(error){
        res.redirect("/admin");
        console.log("error adding new banner"+error)
    }
}

exports.changeActivity=async(req,res)=>{
    try{

        let newActivity = req.body.currentActivity ==='true';
        newActivity = !newActivity;
        await bannerCollection.updateOne({_id:req.body.bannerID},{$set:{active:newActivity}});
        res.json({
            data: {activity: 1,},   });
    }catch(error){
        res.redirect("/admin");
        console.log("error on changing banner activity")
    }
}

exports.deleteBanner=async(req,res)=>{
    try{
        let bannerId=req.body.bannerID
        await bannerCollection.deleteOne({_id:bannerId});
        res.json({
            data:{deleted:1}
        })

    }catch(error){
        res.redirect("/admin");
        console.log("error on banner deleting "+error)
    }
}