const userCollection = require("../../models/user/details")




exports.viewPage = async (req, res) => {
    try {
        const userID=req.session.userID;
        const currentUser =await userCollection.findById(userID);
        let allAddresses=currentUser.addresses;
        if (allAddresses == "") {
            allAddresses = null;
          }
        res.render("user/profile/partials/address", {
            documentTitle: "User Addresses",
            allAddresses,
        });

    } catch (error) {
        res.redirect('/');
        console.log("error on rendring address page:" + error)
    }
}

exports.addNew = async (req, res) => {
    try {
        const buildingName = req.body.building;
        const address = req.body.address;
        const pincode = req.body.pincode;
        const country = req.body.country;
        const contactNumber = req.body.contactNumber;
        const userID = req.session.userID;

        await userCollection.updateOne({ _id: userID , "addresses.primary":true}, {
         $set:{'addresses.$.primary':false}
        })
        await userCollection.updateOne({_id: userID },{
            $push:{
                addresses:{
                    building: buildingName,
                    address: address,
                    pincode: pincode,
                    country: country,
                    contactNumber: contactNumber,
                    primary: true,
                }
            }
        })

        res.redirect("/users/addresses");
    } catch (error) {
        res.redirect('/');
        console.log("error on adding new adress :" + error)
    }
}

exports.deleteAddress=async(req,res)=>{
    try{
        const addressID=req.query.addressID;
        await userCollection.updateOne({_id:req.session.userID},{
            $pull:{
                addresses:{
                    _id:addressID
                }
            }
        });
        res.redirect("/users/addresses");


    }catch(error){
        res.redirect("/");
        console.log("error on deleting address : "+error);
    }
}

exports.defaultToggler=async(req,res)=>{
    try{
        const addressID=req.query.addressID;
        await userCollection.updateOne({_id:req.session.userID,"addresses.primary":true},{$set:{"addresses.$.primary":false}});
        await userCollection.updateOne({_id:req.session.userID,"addresses._id":addressID},{$set:{"addresses.$.primary":true}});
        res.redirect("/users/addresses");
    }catch(error){
        res.redirect("/")
        cosnole.log("error on default toggler :"+error)
    }
}