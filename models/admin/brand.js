const mongoose=require("mongoose");



const  brandSchema= new mongoose.Schema({
    name: {
        type: String,
        require,
        unique: true,
      },
})

const brandDetails=mongoose.model("Brands",brandSchema)

module.exports=brandDetails