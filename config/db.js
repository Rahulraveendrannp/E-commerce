const mongoose=require("mongoose");


mongoose.connect("mongodb://127.0.0.1/ShoeZone",{ 
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true
}).then(()=>{
    console.log('mongodb connction successful');
}).catch((err)=>{
    console.log('mongodb connction erroe' +err);
})