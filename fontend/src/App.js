import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './page/Home'
import Employee from './page/Employee';
import ReportEmp from './page/ReportEmp';
import DetailCourse from './page/DetailCourse';
// import ReportCourse from './page/ReportCourse';
import AddCourse from './page/AddCourse';
import AddEmp from './page/AddEmp';
import AddEmpAdmin from './page/AddEmpAdmin';
import Login from './page/Login';
import ReqRequireAuth from './context/RequireAuth'
import { AuthProvider } from './context/AuthProvider';




function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Lock Page */}
        <Route path='employee' element={<ReqRequireAuth><Employee /></ReqRequireAuth>} />
        <Route path='add-emp-admin' element={<ReqRequireAuth><AddEmpAdmin /></ReqRequireAuth>} />
        <Route path='add-course' element={<ReqRequireAuth><AddCourse /></ReqRequireAuth>} />

        {/* don't Locck Page */}
        <Route path='/' element={<Home />} />
        <Route path='add-employee' element={<AddEmp />} />


        {/* send data  */}
        <Route path='report-emp/:id' element={<ReportEmp />} />
        <Route path='detail-course/:id' element={<DetailCourse />} />
        {/* <Route path='report-course' element={<ReportCourse />} /> */}


        <Route path='login' element={<Login />} />

      </Routes>
    </AuthProvider>
  );
}

export default App;
