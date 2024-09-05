import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="container text-center mt-5">
            <h1>Welcome to CoEdit</h1>
            <Link to="/login" className="btn btn-primary mx-2">Login</Link> 
            or 
            <Link to="/register" className="btn btn-secondary mx-2">Register</Link>
        </div>
    );
}

export default Home;
