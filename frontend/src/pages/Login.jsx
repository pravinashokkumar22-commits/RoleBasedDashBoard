import React, { useState } from 'react'
import Email from '../assets/email.png'
import Password from '../assets/password.png'
import './LogInSignUP.css'
import { Link } from 'react-router-dom'
import { getUser,saveToken } from '../utils/auth'
import { useNavigate } from 'react-router-dom'
const Login = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState({})

    // handle input changes
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

        // clear error while typing
        setErrors({
            ...errors,
            [e.target.name]: ''
        })
    }

    // form validation
    const validateForm = () => {

        let newErrors = {}

        // email validation
        if (!formData.email.trim()) {

            newErrors.email = "Email is required"

        } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
        ) {

            newErrors.email = "Invalid email address"
        }
        // password validation
        if (!formData.password.trim()) {

            newErrors.password = "Password is required"
        } else if (formData.password.length < 6) {

            newErrors.password =
                "Password must be at least 6 characters"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }
    // login submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        // stop if validation fails
        if (!validateForm()) {
            return
        }
        try {

            const response = await fetch(
                'http://localhost:5000/auth/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                }
            )
            const data = await response.json()
            console.log(data)
            if (response.ok) {
                // save JWT token
                saveToken(data.data.token)
                const user = getUser()
                if (user.role === 'admin') {
                    navigate('/admin')
                }else{
                    navigate('/user')
                }
                console.log("Token saved:", data.data.token)
                alert("Login Successful")
                // clear form
                setFormData({
                    email: '',
                    password: ''
                })
            } else {
                alert(data.message || "Login Failed")
            }
        } catch (error) {
            console.log(error)
            alert("Server Error")
        }
    }
    return (
        <form className="container" onSubmit={handleSubmit}>
            <div className="header">
                <div className="text">
                    Login
                </div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {/* EMAIL */}
                <div>
                    <div className="input">
                        <img
                            src={Email}
                            alt='email logo'
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder='Enter Your Email'
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {errors.email &&
                        <p className='error'>
                            {errors.email}
                        </p>
                    }
                </div>
                {/* PASSWORD */}
                <div>
                    <div className="input">
                        <img
                            src={Password}
                            alt='password logo'
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder='Enter Your Password'
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {errors.password &&
                        <p className='error'>
                            {errors.password}
                        </p>
                    }
                </div>
            </div>
            <div className="forgot-password">Don't have an account? <Link to="/">Sign Up</Link></div>
            <div className="submit-container">
                <button type="submit" className="submit">Login</button>
            </div>
        </form>
    )
}
export default Login