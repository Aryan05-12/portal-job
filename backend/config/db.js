const mongoose = require('mongoose');
const ConnectDB = async () => {

    try{

       await mongoose.connect('mongodb://localhost:27017/job')
        console.log(" Congratulation! MongoDB is Connected and Working")
    }catch(error){
            console.log("Sorry MongoDb is Disconnected",error)
    }
}

module.exports = ConnectDB;