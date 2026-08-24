const express = require("express");

const {
  register,
  login,
  JobRegister,
  updateProfile,
  adminLogin,
  postJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
  getAllUsers,
  updateUser,
  deleteUser,
  dashboardData,
  createCategory,
  getCategories,
  getSingleUserzz,
  getSiteContent,
  updateSiteContent,
  Aichat,
  applyJob,
  getAllApplications,
  updateStatus,
  getApplication,
  forgotPassword,
  resetPassword,
  testMail,
  updateCategory,
  deleteCategory
} = require("../controller/AuthController");

const {getRegUser} = require('../controller/AuthController')


const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/jobregister',JobRegister);
router.put('/update-jobregister/:id',updateProfile)
router.post('/admin-login' ,adminLogin);
router.post('/jobs', postJob);
router.get('/jobs', getAllJobs);
router.get('/jobs/:id', getSingleJob);
router.put('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);
router.get('/users', getAllUsers);
router.get('/users/:id',getSingleUserzz);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/dashboard', dashboardData);
router.post('/createcategory', createCategory);
router.get('/categories', getCategories);
router.put('/categories/:id',updateCategory);
router.delete('/categories/:id',deleteCategory)
router.get('/All-reg-user',getRegUser);
router.get('/site-content/:page', getSiteContent);
router.post('/ai-chat',Aichat);
router.put('/site-content/:page', updateSiteContent);
router.post('/applications' , applyJob);
router.get('/applications',getAllApplications);
router.put('/applications/:id' ,updateStatus);
router.get('/my-apply/:userId',getApplication);
router.post("/forgotPassword", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get('/test-mail',testMail)

module.exports = router;
