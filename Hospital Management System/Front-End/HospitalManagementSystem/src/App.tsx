import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/Auth/Login";
import Logout from "./pages/Auth/Logout";
import NotFound from "./pages/Auth/NotFound"
import Sidebar from "./components/Sidebar";
import ThemeToggle from "./components/ThemeToggle";
import NotAuthorized from "./pages/Auth/NotAuthorized";
import PatientPage from "./pages/Patient/PatientPage";
import BookAppointmentPage from "./pages/Patient/BookAppointmentPage";
import MyAppointmentsPage from "./pages/Patient/MyAppointmentsPage";
import DoctorProfilePage from "./pages/Doctor/DoctorProfilePage";
import DoctorMyAppointmentsPage from "./pages/Doctor/DoctorMyAppointmentsPage";
import AdminDashboardPage from "./pages/Admin/AdminDashboardPage";
import AdminPatientPage from "./pages/Admin/AdminPatientPage";
import AdminDoctorPage from "./pages/Admin/AdminDoctorPage";
import AdminAppointmentPage from "./pages/Admin/AdminAppointmentPage";


function App() {


  return (
    <Router>
      <ThemeToggle>
        <Sidebar />
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>

            <Route path="/admin" element={<AdminDashboardPage />}>
              <Route index element={null} />
              <Route path="add" element={null} />
            </Route>

            <Route path="admin/patients" element={<AdminPatientPage />}>
              <Route index element={null} />
              <Route path="add" element={null} />
              <Route path=":id" element={null} />
              <Route path="edit/:id" element={null} />
              <Route path="delete/:id" element={null} />
            </Route>

            <Route path="admin/doctors" element={<AdminDoctorPage />}>
              <Route index element={null} />
              <Route path="add" element={null} />
              <Route path=":id" element={null} />
              <Route path="edit/:id" element={null} />
              <Route path="delete/:id" element={null} />
            </Route>

            <Route path="admin/appointments" element={<AdminAppointmentPage />}>
              <Route index element={null} />
              <Route path="add" element={null} />
              <Route path=":id" element={null} />
              <Route path="edit/:id" element={null} />
              <Route path="delete/:id" element={null} />
            </Route>


            <Route path="/admin/logout" element={<Logout />} />

          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Patient']} />}>

            <Route path="/patient" element={<PatientPage />} />

            <Route path="/patient/book-appointment" element={<BookAppointmentPage />} />

            <Route path="/patient/my-appointments" element={<MyAppointmentsPage />} />

            <Route path="/patient/logout" element={<Logout />} />

          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Doctor']} />}>

            <Route path="/doctor" element={<DoctorProfilePage />} />

            <Route path="/doctor/my-appointments" element={<DoctorMyAppointmentsPage />} />

            <Route path="/doctor/logout" element={<Logout />} />

          </Route>


          <Route path="not-authorized" element={<NotAuthorized />} />
          <Route path="*" element={< NotFound />} />
        </Routes>
      </ThemeToggle>
    </Router>
  )
}

export default App
