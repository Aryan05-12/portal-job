const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job", // Agar tumhari Job collection ka naam 'Job' hai
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  userId: {
    type: String, // Agar tumhara User model alag h to ObjectId bhi kar sakte ho
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"], // Sirf yahi 3 status ho sakte hain
    default: "Pending", // <--- By default 'Pending' save hoga
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Apply", ApplicationSchema);