import { useState } from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import AdminDashboard from './dashboards/AdminDashboard'
import UserDashboard from './dashboards/UserDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Register />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/user" element={<ProtectedRoute role={["admin","user"]}><UserDashboard /> </ProtectedRoute>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
