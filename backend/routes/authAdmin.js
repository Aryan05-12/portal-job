const bcrypt = require('bcrypt');
const MongoDB = require('../config/db');
const Admin = require('../model/admin');
require('dotenv').config({ path: '../.env' });

const creatAdmin = async () => {

    try {
        await MongoDB();
        console.log("Mongo Connect")

        if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.log("ADMIN_EMAIL or ADMIN_PASSWORD missing in .env");
      return;
    }

    const AdminExist = await Admin.findOne({

        email : process.env.ADMIN_EMAIL,
    });

    if (AdminExist) {
      console.log(" Admin already exists");
      return;
    }

    const hashPass = await bcrypt.hash(process.env.ADMIN_PASSWORD,10);

    const admin = await Admin.create({
      name: "Aryan",
      email: process.env.ADMIN_EMAIL,
      password: hashPass, 
      role: "admin",
    }); 

    } catch(err){
                  console.log("ERROR:", err);
    } finally {
    process.exit();
  }
};

creatAdmin();