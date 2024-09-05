import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Attempting to log in with:', { email, password });
        try {
            const response = await axios.post('http://localhost:5000/auth/login', { email, password });
            const { token, refreshToken, userId } = response.data

            console.log('JWT Token:', token);
            console.log('Refresh Token:', refreshToken);
            

            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('userId', userId);

            onLogin(token, email);
            navigate('/dashboard');
        } catch (error) {
            if (error.response) {
                console.error('Login error:', error.response.data);
            } else {
                console.error('Unexpected error:', error.message);
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <input 
                        type="email" 
                        className="form-control" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Email" 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <input 
                        type="password" 
                        className="form-control" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Password" 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
}

export default Login;
