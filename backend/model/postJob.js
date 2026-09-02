const mongoose = require('mongoose');
const postJobScehema = new mongoose.Schema({

    category:{
        type:String
    },
    jobTitle:{
        type:String
    },
    jobType:{
       type:String
    },
    salary:{
       type:String 
    },
    skill:{
       type:String 
    },
    expirence:{
       type:String 
    },
    location:{
       type:String 
    },
    date:{
        type:Date
    },
    description:{
        type:String 
    },
    employerId:{
        type:String
    },
    employerName:{
        type:String
    },
    employerEmail:{
        type:String
    },
    companyName:{
        type:String
    }
}, { timestamps: true })

module.exports = mongoose.model('PostJob', postJobScehema);
