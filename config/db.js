const mongoose=require("mongoose");

mongoose.connect(process.env.MONGO_URL,{ 
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true
}).then(()=>{
    console.log('mongodb connction successful');
}).catch((err)=>{
    console.log('mongodb connction error :' +err);
})
