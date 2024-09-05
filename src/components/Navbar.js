import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Navbar({ token, setToken }) {
    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            console.log('Refresh Token:', refreshToken);

            await axios.post('http://localhost:5000/auth/logout', { token: refreshToken });

            // Clear tokens from local storage
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');

            // Optionally clear token state
            setToken(null);

            // Redirect to login page
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">CoEdit</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                        {token ? (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                                <li className="nav-item">
                                    <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
