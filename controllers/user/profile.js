const { default: mongoose } = require("mongoose");
const userCollection = require("../../models/user/details");


exports.viewPage = async (req, res) => {
    try {
        let userID = req.session.userID;
        let currentUser = await userCollection.findById(userID);
        let defaultAddress = await userCollection.aggregate([
            {
                $match: { _id:new mongoose.Types.ObjectId (userID) },
            },
            { $unwind: "$addresses" },
            { $match: { "addresses.primary": true } }
        ]);
        res.render("user/profile/partials/profile", {
            documentTitle: "User Profile",
            currentUser,
            defaultAddress,
        });
    } catch (error) {
        res.redirect('/');
        console.log("error on rendering profile page:" + error)

    }
}

exports.upadteUser = async (req, res) => {
    try {
        const userID = req.session.userID;
        const newName = req.body.name;
        const filteredBody = { name: newName };
        if (req.file) {
            filteredBody.photo = req.file.filename;
        }
        await userCollection.findByIdAndUpdate(userID, filteredBody);
        res.redirect("/users/profile");

    } catch (error) {
        res.redirect("/users/profile");
        console.log("error on profile upadtion;" + error)
    }
}
