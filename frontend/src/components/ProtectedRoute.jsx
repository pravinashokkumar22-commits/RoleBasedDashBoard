import React from 'react'
import { Navigate } from 'react-router-dom'
import { getToken, getUser } from '../utils/auth'

const ProtectedRoute = ({ children, role }) => {
    const token = getToken()
    const user = getUser()
    if (!token) {
        return <Navigate to="/login" />
    }
    if (role && user.role !== role) {
        return <Navigate to="/login" />
    }
    return children
}
export default ProtectedRoute