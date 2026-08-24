import Adminlog from "./Admin/Adminlog";
import About from "./components/About";
import Contact from "./components/Contact";
import Content from "./components/Content"
import JobSeeker from "./components/JobSeeker"
import Nav from "./components/Nav"
import { Route, Routes } from 'react-router-dom';
import Seeker from "./components/Seeker";
import AdminNav from "./Admin/AdminNav";
import EmployerReg from "./components/EmployerReg";
import Report from "./pages/Report";
import ManageAccount from "./pages/ManageAccount";
import PostJob from "./pages/PostJob";
import JobsListing from "./pages/JobsListing";
import AdminCategory from "./Admin/AdminCategory";
import AdminLayout from "./Admin/AdminLayout";
import AdminDashboard from "./Admin/AdminDashboard";
import JobDetails from "./pages/JobDetails";
import AdminmanageC from "./Admin/AdminmanageC";
import ListEmployee from "./pages/ListEmployee";
import ViewList from "./pages/ViewList";
import AllUser from "./pages/AllUser";
import AdminPageEditor from "./Admin/AdminPageEditor";
import AiChat from "./Gemini/AiChat";
import SingleJob from "./components/SingleJob";
import ApplyJob from "./pages/EmployerProfile";
import EmployerProfile from "./pages/EmployerProfile";
import EditProfile from "./pages/EditProfile";
import AddEducation from "./pages/AddEducation";
import AddExperience from "./pages/AddExperince";
import AdminApplication from "./Admin/AdminApplication";
import ApplyAllJob from "./components/ApplyAllJob";
import ForgotPassword from "./pages/ForgetPassword";
import EditCategory from "./Admin/EditCategory";
import AdminReports from "./Admin/AdminReports";

function App() {


  return (
    <div>
       
          <Routes>
            <Route path="/" element={<Content/>} />
            <Route path="/aichatbox" element={<AiChat/>}/>
            
            <Route path="/job-seeker" element={<Seeker/>} />
            <Route path="/employer" element={<EmployerReg/>} />
            <Route path="/employer-signup" element={<JobSeeker/>}/>
          
            <Route path="/admin" element={<Adminlog/>} />
            
            <Route path="/about-us" element={<About/>} />
            <Route path="/contact-us" element={<Contact/>} />
            <Route path="/job-signup" element={<EmployerReg/>}/>
            <Route path="/reports" element={<Report/>}/>
            <Route path="/manage-account" element={<ManageAccount/>}/>
            <Route path="/post-job" element={<PostJob/>}/>
            <Route path="/manage-job" element={<JobsListing/>}/>

            
              <Route path="/applications-details" element={<JobDetails />} />
            <Route path="/applications-details/:id" element={<JobDetails/>}/>
            <Route path="/forget-pass"  element={<ForgotPassword/>}/>


            <Route path="/view-employee" element={<ViewList/>}/>
             <Route path="/view-employee/:id" element={<ViewList/>}/>
             <Route path="/jobs/:id" element={<SingleJob/>}/>
             <Route path="/apply/:id" element={<ApplyJob/>}/>
             <Route path="/eprofile" element={<EmployerProfile/>}/>
             <Route path="/editProfile" element={<EditProfile/>}/>
            <Route path="/education"  element={<AddEducation/>}/>
            <Route path="/experience" element={<AddExperience/>}/>
            <Route path="/applied-job" element={<ApplyAllJob/>}/>

            <Route element={<AdminLayout/>}>
             <Route path="/admindash" element={<AdminDashboard/>}/>
            <Route path="/add-category" element={<AdminCategory/>}/>
            <Route path="manage-category" element={<AdminmanageC/>}/>
            <Route path="/list-employee" element={<ListEmployee/>}/>
            <Route path="/reg-jobseeker" element={<AllUser/>}/>
            <Route path="/admin-about" element={<AdminPageEditor page="about"/>}/>
            <Route path="/admin-contact" element={<AdminPageEditor page="contact"/>}/>
            <Route path="/admin-application" element={<AdminApplication/>}/>
            <Route path="/admin/edit-category/:id"  element={<EditCategory/>}/>
            <Route path="/date-reports" element={<AdminReports/>}/>

            
          
            </Route>

          </Routes>
      
      </div>
  )
}

export default App
