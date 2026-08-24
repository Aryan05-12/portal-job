const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name:{
        type:String
    },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // Ek email se ek hi account
    lowercase: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6 // Security ke liye minimum length
  },
  resume: {
    type: String, // Yahan file ka path ya URL store hoga
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
,
    
    contact: {
        type: String
    },
    tagline: {
        type: String
    },
    website: {
        type: String
    },
    logoName: {
        type: String
    },
    logo: {
        type: String
    },
    companyName: {
        type: String
    },
    description: {
        type: String
    },
    employees: {
        type: String
    },
    industry: {
        type: String
    },
    businessType: {
        type: String
    },
    location: {
        type: String
    },
    establishedIn: {
        type: String
    },
    role:{
   type:String,
   default:"user"
},
resetToken: String,
  resetTokenExpire: Date,

})

module.exports = mongoose.model('User', userSchema);
