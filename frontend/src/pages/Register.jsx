import React, { useState } from 'react'
import Email from '../assets/email.png'
import Person from '../assets/person.png'
import Password from '../assets/password.png'
import './LogInSignUP.css'
import { Link, useNavigate } from 'react-router-dom'

const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
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
        // name validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
        }
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
            newErrors.password = "Password must be at least 6 characters"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }
    // signup submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        // stop if validation fails
        if (!validateForm()) {
            return
        }
        try {
            const response = await fetch(
                'http://localhost:5000/auth/register',
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
                alert("Signup Successful")
                navigate('/login')
                // clear form
                setFormData({
                    name: '',
                    email: '',
                    password: ''
                })

            } else {

                alert(data.message || "Signup Failed")
            }
        } catch (error) {

            console.log(error)
            alert("Server Error")
        }
    }
    return (
        <form className="container" onSubmit={handleSubmit}>
            <div className="header">
                <div className="text">SignUp</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div>
                    <div className="input">
                        <img
                            src={Person}
                            alt='user logo'
                        />
                        <input
                            type="text"
                            name="name"
                            placeholder='Enter Your Name'
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {errors.name &&<p className='error'>{errors.name}</p>}
                </div>
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
                    {errors.email && <p className='error'>{errors.email}</p>}
                </div>
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
                    {errors.password &&<p className='error'>{errors.password}</p>}
                </div>
            </div>
                <div className="forgot-password">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            <div className="submit-container">
                    <button type="submit" className="submit"> Signup</button>
            </div>
        </form>
    )
}
export default Register