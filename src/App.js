import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import DocumentEditor from './components/DocumentEditor';
import './App.css';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [username, setUsername] = useState('');

    const handleLogin = (token, username) => {
        setToken(token);
        setUsername(username);
        localStorage.setItem('token', token);
    };

    return (
        <Router>
            <Navbar token={token} setToken={setToken} />
            <div className="container">
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={token ? <Dashboard token={token} /> : <Home />} />
                    <Route path="/documents/:id" element={token ? <DocumentEditor token={token} username={username} /> : <Home />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
