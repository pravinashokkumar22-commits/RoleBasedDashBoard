import React from 'react'
import { removeToken } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
    const navigate = useNavigate()
    const logout = () => {
        removeToken()
        navigate('/login')
    }
    return (
        <div>
            <h1>
                Admin Dashboard
            </h1>
            <button onClick={logout}>
                Logout
            </button>
        </div>
    )
}

export default AdminDashboard