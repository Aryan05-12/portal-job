const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Admin = require('../model/admin');
const Job = require('../model/postJob');
const Category = require('../model/category');
const SiteContent = require('../model/siteContent');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Application = require('../model/apply');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendEmail = require('../utils/SendEmai');

const createToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'job_portal_secret', {
        expiresIn: '1d'
    })
}


//ai ka h yeh 
 
exports.Aichat = async (req,res) => {

  try{

    const {message} = req.body;
    const genAI = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

const jobs = await Job.find().sort({ createdAt: -1 }).limit(20);
const categories = await Category.find().sort({ createdAt: -1 });
const about = await SiteContent.findOne({ page: "about" });
const contact = await SiteContent.findOne({ page: "contact" });



    const prompt = `
You are an AI assistant for this Job Portal website.

Rules:
- Answer only using the website data below.
- If information is not available, say: "Is information ka data portal mein available nahi hai."
- Keep answers short and helpful.
- Reply in the same language as the user.
- If user asks about jobs, mention job title, category, type, salary, skills, experience and location.

About Page:
Title: ${about?.title || ""}
Subtitle: ${about?.subtitle || ""}
Body: ${about?.body || ""}

Contact Page:
Title: ${contact?.title || ""}
Phone: ${contact?.phone || ""}
Email: ${contact?.email || ""}
Address: ${contact?.address || ""}

Categories:
${categories.map((c) => `
Name: ${c.name}
Description: ${c.description}
`).join("\n")}

Jobs:
${jobs.map((j) => `
Job Title: ${j.jobTitle}
Category: ${j.category}
Job Type: ${j.jobType}
Salary: ${j.salary}
Skills: ${j.skill}
Experience: ${j.expirence}
Location: ${j.location}
Date: ${j.date}
Description: ${j.description}
`).join("\n")}

User Question:
${message}
`;
    const result = await model.generateContent(prompt);

    const answer = result.response.text();

    res.json({
      sucess:true,
      answer,

    })
  }catch(error){

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


exports.register = async (req, res) => {

    try {

        const { email, phone, contact, contactNumber, fullName, name, password, tagline, website, logoName, logo, photo, resume, resumeName } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();
        const userName = name || fullName;
        const userContact = contact || contactNumber || phone;

        if (!normalizedEmail || !userName || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            })
        }

        const isUserExists = await User.findOne({ email: normalizedEmail })

        if (isUserExists) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashpass = await bcrypt.hash(password, 10)

        const user = await User.create({
            email: normalizedEmail,
            contact: userContact,
            contactNumber: userContact,
            fullName: userName,
            name: userName,
            password: hashpass,
            tagline,
            website,
            logoName,
            logo,
            photo,
            resume,
            resumeName
        })

        const token = createToken(user._id)

        res.status(201).json({
            message: "Created successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                contact: user.contact,
                tagline: user.tagline,
                website: user.website,
                logoName: user.logoName,
                logo: user.logo,
                photo: user.photo,
                resume: user.resume,
                resumeName: user.resumeName
            }
        })

    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }

}

exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        if (!normalizedEmail || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        const user = await User.findOne({ email: normalizedEmail })

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        const token = createToken(user._id)

        res.status(200).json({
            message: "Login successful",
            token,
           user: {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    contactNumber: user.contactNumber,
    tagline: user.tagline,
    website: user.website,
    logoName: user.logoName,
    logo: user.logo,
    resume: user.resume,
    photo: user.photo
}
        })

    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }

}


exports.JobRegister = async (req, res) => {
  try {
    const { fullName, email, contactNumber, password } = req.body;



      const Hashpass = await bcrypt.hash(password, 10)
    // Naya user create karein
    const newUser = new User({
      fullName,
      email,
      contactNumber,
      password: Hashpass,
      resume: req.file ? req.file.path : null 
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateProfile = async (req, res) => {
  try {

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    if (req.file) {
      req.body.resume = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Profile Updated",
      updatedUser
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


//admin login page 
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if admin exists
    const admin = await User.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 3. Password ko object se hatao taaki frontend pe na jaye (Security)
    const adminData = admin.toObject();
    delete adminData.password;

    // 4. Simple Response bhej do
    res.status(200).json({
      message: "Login successful",
      admin: adminData // Ye frontend par save ho jayega
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// POST JOB
// ==============================
exports.postJob = async (req, res) => {
  try {
    const {
      category,
      jobTitle,
      jobType,
      salary,
      skill,
      expirence,
      location,
      date,
      description,
      employerId,
      employerName,
      employerEmail,
      companyName,
    } = req.body;

    // Validation
    if (!category || !jobTitle || !date) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Create Job
    const newJob = await Job.create({
      category,
      jobTitle,
      jobType,
      salary,
      skill,
      expirence,
      location,
      date,
      description,
      employerId,
      employerName,
      employerEmail,
      companyName,
    });

    res.status(201).json({
      success: true,
      message: "Job posted successfully",
      job: newJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==============================
// GET ALL JOBS
// ==============================
exports.getAllJobs = async (req, res) => {
  try {
    const filter = req.query.employerId ? { employerId: req.query.employerId } : {};
    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};




exports.getAllJobs = async (req, res) => {
  try {
    const filter = req.query.employerId ? { employerId: req.query.employerId } : {};
    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalJobs: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};



exports.getRegUser = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select("-password");

    res.status(200).json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==============================
// GET SINGLE JOB
// ==============================



// ==============================
exports.getSingleJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};



exports.getSingleUserzz = async (req, res) => {
  try {
    // 1. Database se user find kiya aur use 'user' variable me save kiya
    const user = await User.findById(req.params.id);

    // 2. Agar user nahi mila toh 404 return kiya
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    // 3. 👑 FIX: Yahan 'job' ki jagah 'user' bhejenge
    res.status(200).json({
      success: true,
      user, // <--- Yeh change kiya hai
    });

  } catch (error) {
    // Agar koi aur error aata hai (jaise galat ID format) toh terminal me bhi dikhega
    console.error("Error in getSingleUserzz:", error); 
    
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==============================
// UPDATE JOB
// ==============================
exports.updateJob = async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==============================
// DELETE JOB
// ==============================
exports.deleteJob = async (req, res) => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);

    if (!deletedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select("-password");

    res.status(200).json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.email) {
      updates.email = updates.email.trim().toLowerCase();
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};



exports.dashboardData = async (req, res) => {
  try {
    const [users, jobs, categories, applications] = await Promise.all([
      User.find().sort({ createdAt: -1 }).select("-password"),
      Job.find().sort({ createdAt: -1 }),
      Category.find().sort({ createdAt: -1 }),
      Application.find().sort({ date: -1 }),
    ]);

    res.status(200).json({
      success: true,
      counts: {
        employers: users.length,
        jobs: jobs.length,
        categories: categories.length,
        applications: applications.length,
        accepted: applications.filter((app) => app.status === "Accepted").length,
        rejected: applications.filter((app) => app.status === "Rejected").length,
        pending: applications.filter((app) => !app.status || app.status === "Pending").length,
      },
      users,
      jobs,
      categories,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Category name and description are required",
      });
    }

    const category = await Category.create({ name, description });

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalCategories: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};



exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(
      req.params.id
    );

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




const defaultContent = {
  about: {
    page: "about",
    title: "About Job Portal",
    subtitle: "Connecting talented people with better opportunities.",
    body: "Job Portal helps job seekers discover roles and employers manage hiring in one clean platform.",
    phone: "",
    email: "",
    address: "",
  },
  contact: {
    page: "contact",
    title: "Get In Touch",
    subtitle: "We are here to help with hiring and job search questions.",
    body: "Reach out to our team for support, employer queries, or general information.",
    phone: "+1 (123) 456-7890",
    email: "support@jobportal.com",
    address: "123 Business Avenue, Suite 100, New York, NY",
  },
};

exports.getSiteContent = async (req, res) => {
  try {
    const page = req.params.page;

    if (!["about", "contact"].includes(page)) {
      return res.status(400).json({
        success: false,
        message: "Invalid page",
      });
    }

    let content = await SiteContent.findOne({ page });

    if (!content) {
      content = await SiteContent.create(defaultContent[page]);
    }

    res.status(200).json({
      success: true,
      content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.updateSiteContent = async (req, res) => {
  try {
    const page = req.params.page;

    if (!["about", "contact"].includes(page)) {
      return res.status(400).json({
        success: false,
        message: "Invalid page",
      });
    }

    const payload = {
      ...defaultContent[page],
      ...req.body,
      page,
    };

    const content = await SiteContent.findOneAndUpdate(
      { page },
      payload,
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Page content updated successfully",
      content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};



exports.applyJob = async (req, res) => {
  try {
    const { jobId, jobTitle, userId, userName, userEmail, resume, resumeName } = req.body;

    // Check karo duplicate application toh nahi hai
    const alreadyApplied = await Application.findOne({ jobId, userId });
    if (alreadyApplied) {
      return res.status(400).json({ 
        message: "Bhai, tum is job ke liye pehle hi apply kar chuke ho! ⏳" 
      });
    }

    const user = await User.findById(userId).select("-password");

    const newApplication = new Application({
      jobId,
      jobTitle,
      userId,
      userName: userName || user?.fullName || user?.name || "Candidate",
      userEmail: userEmail || user?.email || "",
      resume: resume || user?.resume || "",
      resumeName: resumeName || user?.resumeName || "",
    });

    await newApplication.save();
    res.status(201).json({ message: "Applied successfully!", application: newApplication });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error ho gaya bhai!" });
  }
};


exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ date: -1 });
    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: "Data fetch karne me dikkat aayi!" });
  }
};


exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({ message: "Status updated successfully! ", application: updatedApplication });
  } catch (error) {
    res.status(500).json({ message: "Status update nahi ho paya!" });
  }
};



exports.getApplication = async (req,res) => {
  try{
    const application = await Application.find({
      userId: req.params.userId,
    });

    res.status(200).json(application);
  }catch(err){
    res.status(500).json({
      message:err.message,
    })
  }
}




exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid or Expired Token",
    });
  }
  user.password = await bcrypt.hash(password, 10);

  user.resetToken = undefined;
  user.resetTokenExpire = undefined;

  await user.save();

  res.json({
    message: "Password Reset Successfully",
  });
};



exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetToken = resetToken;
  user.resetTokenExpire = Date.now() + 15 * 60 * 1000;

  await user.save();

  const resetUrl = `http://localhost:1111/reset-password/${resetToken}`;

  // email send logic

  res.json({
    message: "Reset link sent to email",
    resetUrl,
  });
};


exports.testMail = async (req, res) => {
  try {
    await sendEmail(
      "receiver@gmail.com",
      "Testing Email",
      "<h1>Hello Bhai 😎</h1>"
    );

    res.status(200).json({
      success: true,
      message: "Email Sent Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Email Failed",
    });
  }
};