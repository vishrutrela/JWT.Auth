//require the library
const mongoose = require('mongoose');


exports.connect = () => {
    //connect mongoose to the database
    mongoose.connect('mongodb+srv://vishrutrela:IAMNITIAN@cluster0.idwtat0.mongodb.net/AuthApp',{
        
    })
    .then(()=>{console.log("db connection successfully")})
    .catch((err)=>{
        console.log("err.in db connection")
    })
}






