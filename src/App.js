import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import Login from './pages/loginPage/loginPage.js'
import ForgotPassword from './pages/forgotPassword/forgotPassword.js'

import LandingPage from './pages/landingPage/index.js'
import MainLayout from './pages/layouts/MainLayout.js'
//import AdminLayout from './pages/layouts/AdminLayout.js'

import Register from './pages/registerPage/register.js'
import GridPage from './pages/gridPage/gridPage.js'
import ProfilePage from './pages/profilePage/userProfile.js'
import AdminPage from './pages/adminPage/adminPage.js'
import AdminUsers from './pages/adminPage/adminUsers.js'
import AdminSettings from './pages/adminPage/adminProfilePage.js'
import './App.css'
import { jwtDecode } from 'jwt-decode'

import { cookies } from './utils/cookie'
import Dashboard from './pages/monitorPage/monitorPage.js'
import MaintanancePage from './pages/maintanancePage/maintanancePage.js'
import TeamMembersPage from './pages/teamMembersPage/teamMembersPage.js'
import IntegrationsPage from './pages/inegrationsPage/inegrationsPage.js'
import ResetPassword from './pages/resetPasswordPage/resetPassword.js'
import MonitoringReportsPage from './pages/monitoringReportsPage/monitoringReportsPage.js'
import InstantControlPage from './pages/instantControlPage/instantControlPage.js'
import NewMonitorPage from './pages/monitorPage/newMonitorPage.js'
import PingMonitorFormPage from './pages/monitorPage/pingMonitorFormPage.js'
import KeyWordMonitorFormPage from './pages/monitorPage/keyWordMonitorFormPage.js'
import PortMonitorFormPage from './pages/monitorPage/portMonitorFormPage.js'
import CronJobMonitorFormPage from './pages/monitorPage/cronJobMonitorForm.js'
import NewUser from './pages/adminPage/newUser.js'
import UserDetail from './pages/adminPage/userDetail.js'
import AdmimMonitors from './pages/adminPage/adminMonitorPage.js'
import AdminMaintance from './pages/adminPage/adminMaintanance/maintanancePage.js'
import AdminMonitoringReportsPage from './pages/adminPage/adminMonitoringReportsPage.js'
const NotFound = () => {
  return (
    <div
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        display: 'flex',
        mt: '10%',
        gap: 10,
      }}
    >
      <h1 style={{ gap: 1, display: 'flex' }}>
        Aradığınız sayfa bulunamadı veya bu sayfayı görmeye yetkiniz yok.{'\t'}
      </h1>
    </div>
  )
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      const jwtToken = cookies.get("jwt-access");
      if (jwtToken) {
        const decodedToken = jwtDecode(jwtToken);
        const userRole = decodedToken.role;
        if (userRole === "admin" && !location.pathname.startsWith("/admin")) {
          navigate("/admin");
        } else if (
          userRole === "user" &&
          location.pathname.startsWith("/admin")
        ) {
          navigate("/NotFound");
        }
      } else if (!jwtToken) {
        if (
          !["/register", "/forgot-password", "/reset-password", "/login", "/"].includes(
            location.pathname
          ) 
        ) {
          navigate("/");
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [navigate, location]);

  if (isLoading) {
    return <div>...</div> // veya bir yükleme spinner'ı
  }

  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <LandingPage />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />

        <Route path="/user/profile" element={<ProfilePage />} />

        <Route path="/user/gridPage" element={<GridPage />} />

        <Route path="/admin" element={<AdminUsers />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/userMonitors" element={<AdmimMonitors />} />
        <Route path="/admin/userDetail" element={<UserDetail/>} />
        <Route path="/admin/monitors/maintanance" element={<AdminMaintance/>} />
        <Route path="/admin/newUser" element={<NewUser/>} />
        <Route path="/admin/monitors/new/http" element={<NewMonitorPage />} />
        <Route
          path="/admin/monitors/:id/http"
          element={<NewMonitorPage update={true} />}
        />

        <Route
          path="/admin/monitors/new/ping"
          element={<PingMonitorFormPage />}
        />
        <Route
          path="/admin/monitors/:id/ping"
          element={<PingMonitorFormPage update={true} />}
        />

        <Route
          path="/admin/monitors/new/port"
          element={<PortMonitorFormPage />}
        />
        <Route
          path="/admin/monitors/:id/port"
          element={<PortMonitorFormPage update={true} />}
        />

        <Route
          path="/admin/monitors/new/keyword"
          element={<KeyWordMonitorFormPage />}
        />
        <Route
          path="/admin/monitors/:id/keyword"
          element={<KeyWordMonitorFormPage update={true} />}
        />

        <Route
          path="/admin/monitors/new/cronjob"
          element={<CronJobMonitorFormPage />}
        />
        <Route
          path="/admin/monitors/:id/cronjob"
          element={<CronJobMonitorFormPage update={true} />}
        />
        <Route
          path="/admin/monitors/report"
          element={<AdminMonitoringReportsPage />}
        />






        <Route path="/user/monitors" element={<Dashboard />} />

        <Route path="/user/monitors/new/http" element={<NewMonitorPage />} />
        <Route
          path="/user/monitors/:id/http"
          element={<NewMonitorPage update={true} />}
        />

        <Route
          path="/user/monitors/new/ping"
          element={<PingMonitorFormPage />}
        />
        <Route
          path="/user/monitors/:id/ping"
          element={<PingMonitorFormPage update={true} />}
        />

        <Route
          path="/user/monitors/new/port"
          element={<PortMonitorFormPage />}
        />
        <Route
          path="/user/monitors/:id/port"
          element={<PortMonitorFormPage update={true} />}
        />

        <Route
          path="/user/monitors/new/keyword"
          element={<KeyWordMonitorFormPage />}
        />
        <Route
          path="/user/monitors/:id/keyword"
          element={<KeyWordMonitorFormPage update={true} />}
        />

        <Route
          path="/user/monitors/new/cronjob"
          element={<CronJobMonitorFormPage />}
        />
        <Route
          path="/user/monitors/:id/cronjob"
          element={<CronJobMonitorFormPage update={true} />}
        />
        <Route
          path="/user/monitoringReports"
          element={<MonitoringReportsPage />}
        />
        <Route path="/user/instantControl" element={<InstantControlPage />} />
        <Route path="/user/maintanance" element={<MaintanancePage />} />
        <Route path="/user/teamMembers" element={<TeamMembersPage />} />
        <Route path="/user/integrationsApi" element={<IntegrationsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default App
