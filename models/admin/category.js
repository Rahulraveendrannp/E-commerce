const mongoose=require("mongoose");



const  categorySchema= new mongoose.Schema({
    name: {
        type: String,
        require,
        unique: true,
      },
})

const categoryDetails=mongoose.model("Category",categorySchema)

module.exports=categoryDetails