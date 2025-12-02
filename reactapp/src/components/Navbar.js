import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/navigation.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    // Get user info from localStorage
    useEffect(() => {
        const checkUser = () => {
            try {
                const userData = localStorage.getItem('user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('user');
                setUser(null);
            }
        };

        checkUser();

        // Listen for storage changes
        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        // Clear all user data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        
        // Update state
        setUser(null);
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
        
        // Navigate to home page
        navigate('/');
        
        // Show logout message
        setTimeout(() => {
            alert('You have been logged out successfully!');
        }, 100);
    };

    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    // Fixed getInitials function
    function getInitials(fullName) {
        if (!fullName || typeof fullName !== 'string') return 'U';
        
        // Handle case where fullName might be an object or other type
        const nameString = String(fullName).trim();
        if (nameString.length === 0) return 'U';
        
        const names = nameString.split(/\s+/);
        if (names.length === 1) {
            return names[0].substring(0, 2).toUpperCase();
        }
        
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }

    return (
        <nav className="navbar">
            <div className="navbar-content">
                {/* Brand/Logo */}
                <Link to="/" className="navbar-brand">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                    Online Exam System
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-nav desktop-nav">
                    {user ? (
                        // Authenticated User Navigation
                        <>
                            {user.role === 'TEACHER' ? (
                                <>
                                    <Link 
                                        to="/teacher/dashboard" 
                                        className={`navbar-link ${isActiveRoute('/teacher/dashboard') ? 'active' : ''}`}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                            <rect x="3" y="3" width="7" height="7"/>
                                            <rect x="14" y="3" width="7" height="7"/>
                                            <rect x="14" y="14" width="7" height="7"/>
                                            <rect x="3" y="14" width="7" height="7"/>
                                        </svg>
                                        Dashboard
                                    </Link>
                                    <Link 
                                        to="/create-exam" 
                                        className={`navbar-link ${isActiveRoute('/create-exam') ? 'active' : ''}`}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                            <line x1="12" y1="5" x2="12" y2="19"/>
                                            <line x1="5" y1="12" x2="19" y2="12"/>
                                        </svg>
                                        Create Exam
                                    </Link>
                                    <Link 
                                        to="/question-bank" 
                                        className={`navbar-link ${isActiveRoute('/question-bank') ? 'active' : ''}`}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                                        </svg>
                                        Question Bank
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/student/dashboard" 
                                        className={`navbar-link ${isActiveRoute('/student/dashboard') ? 'active' : ''}`}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                            <polyline points="9 22 9 12 15 12 15 22"/>
                                        </svg>
                                        Dashboard
                                    </Link>
                                    <Link 
                                        to="/student/exams" 
                                        className={`navbar-link ${isActiveRoute('/student/exams') ? 'active' : ''}`}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                            <polyline points="14 2 14 8 20 8"/>
                                            <line x1="16" y1="13" x2="8" y2="13"/>
                                            <line x1="16" y1="17" x2="8" y2="17"/>
                                            <polyline points="10 9 9 9 8 9"/>
                                        </svg>
                                        My Exams
                                    </Link>
                                    <Link 
                                        to="/student/results" 
                                        className={`navbar-link ${isActiveRoute('/student/results') ? 'active' : ''}`}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                                        </svg>
                                        Results
                                    </Link>
                                </>
                            )}

                            {/* User Profile Dropdown */}
                            <div className="user-profile" ref={dropdownRef}>
                                <button 
                                    className="profile-button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    aria-haspopup="true"
                                    aria-expanded={isDropdownOpen}
                                >
                                    <div className="user-avatar">
                                        {getInitials(user.fullName || user.name || user.username)}
                                    </div>
                                    <div className="user-info">
                                        <span className="user-name">
                                            {user.fullName || user.name || user.username}
                                        </span>
                                        <span className="user-role">
                                            {user.role?.toLowerCase() || 'user'}
                                        </span>
                                    </div>
                                    <svg 
                                        className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} 
                                        width="12" 
                                        height="12" 
                                        viewBox="0 0 12 12"
                                    >
                                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    </svg>
                                </button>

                                {isDropdownOpen && (
                                    <div className="dropdown-menu">
                                        <div className="dropdown-header">
                                            <div className="user-avatar-large">
                                                {getInitials(user.fullName || user.name || user.username)}
                                            </div>
                                            <div>
                                                <div className="dropdown-name">
                                                    {user.fullName || user.name || user.username}
                                                </div>
                                                <div className="dropdown-email">
                                                    {user.email || `${user.username}@example.com`}
                                                </div>
                                                <div className="dropdown-role">
                                                    {user.role} Account
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dropdown-divider"></div>
                                        <Link to="/profile" className="dropdown-item">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                                <circle cx="12" cy="7" r="4"/>
                                            </svg>
                                            My Profile
                                        </Link>
                                        <Link to="/settings" className="dropdown-item">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                                <circle cx="12" cy="12" r="3"/>
                                                <path d="M12 1v6m0 6v6m5.2-15.6l-3 5.2m-4.4 0l-3-5.2m12.1 3.1l-5.2 3m0 4.4l5.2 3m-3.1-12.1l-3 5.2m-4.4 0l-3-5.2"/>
                                            </svg>
                                            Settings
                                        </Link>
                                        <Link to="/help" className="dropdown-item">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                                <circle cx="12" cy="12" r="10"/>
                                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                                <line x1="12" y1="17" x2="12.01" y2="17"/>
                                            </svg>
                                            Help & Support
                                        </Link>
                                        <div className="dropdown-divider"></div>
                                        <button onClick={handleLogout} className="dropdown-item logout-btn">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                                <polyline points="16 17 21 12 16 7"/>
                                                <line x1="21" y1="12" x2="9" y2="12"/>
                                            </svg>
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        // Guest Navigation
                        <>
                            <Link 
                                to="/about" 
                                className={`navbar-link ${isActiveRoute('/about') ? 'active' : ''}`}
                            >
                                About
                            </Link>
                            <Link 
                                to="/contact" 
                                className={`navbar-link ${isActiveRoute('/contact') ? 'active' : ''}`}
                            >
                                Contact
                            </Link>
                            <Link 
                                to="/login" 
                                className={`navbar-link ${isActiveRoute('/login') ? 'active' : ''}`}
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/signup" 
                                className="navbar-cta"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle mobile menu"
                >
                    <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}></span>
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="mobile-menu" ref={mobileMenuRef}>
                    {user ? (
                        <>
                            {/* User Info in Mobile */}
                            <div className="mobile-user-info">
                                <div className="user-avatar-mobile">
                                    {getInitials(user.fullName || user.name || user.username)}
                                </div>
                                <div>
                                    <div className="mobile-user-name">
                                        {user.fullName || user.name || user.username}
                                    </div>
                                    <div className="mobile-user-role">
                                        {user.role} Account
                                    </div>
                                </div>
                            </div>
                            <div className="mobile-menu-divider"></div>

                            {user.role === 'TEACHER' ? (
                                <>
                                    <Link 
                                        to="/teacher/dashboard" 
                                        className="mobile-menu-item"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                            <rect x="3" y="3" width="7" height="7"/>
                                            <rect x="14" y="3" width="7" height="7"/>
                                            <rect x="14" y="14" width="7" height="7"/>
                                            <rect x="3" y="14" width="7" height="7"/>
                                        </svg>
                                        Dashboard
                                    </Link>
                                    <Link 
                                        to="/create-exam" 
                                        className="mobile-menu-item"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                            <line x1="12" y1="5" x2="12" y2="19"/>
                                            <line x1="5" y1="12" x2="19" y2="12"/>
                                        </svg>
                                        Create Exam
                                    </Link>
                                    <Link 
                                        to="/question-bank" 
                                        className="mobile-menu-item"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                                        </svg>
                                        Question Bank
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/student/dashboard" 
                                        className="mobile-menu-item"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                            <polyline points="9 22 9 12 15 12 15 22"/>
                                        </svg>
                                        Dashboard
                                    </Link>
                                    <Link 
                                        to="/student/exams" 
                                        className="mobile-menu-item"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                            <polyline points="14 2 14 8 20 8"/>
                                            <line x1="16" y1="13" x2="8" y2="13"/>
                                            <line x1="16" y1="17" x2="8" y2="17"/>
                                        </svg>
                                        My Exams
                                    </Link>
                                    <Link 
                                        to="/student/results" 
                                        className="mobile-menu-item"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                                        </svg>
                                        Results
                                    </Link>
                                </>
                            )}
                            
                            <div className="mobile-menu-divider"></div>
                            <Link 
                                to="/profile" 
                                className="mobile-menu-item"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                                My Profile
                            </Link>
                            <Link 
                                to="/settings" 
                                className="mobile-menu-item"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                    <circle cx="12" cy="12" r="3"/>
                                    <path d="M12 1v6m0 6v6m5.2-15.6l-3 5.2m-4.4 0l-3-5.2m12.1 3.1l-5.2 3m0 4.4l5.2 3m-3.1-12.1l-3 5.2m-4.4 0l-3-5.2"/>
                                </svg>
                                Settings
                            </Link>
                            <button 
                                onClick={handleLogout} 
                                className="mobile-menu-item logout-mobile"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{display: 'inline', marginRight: '6px', verticalAlign: 'middle'}}>
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                    <polyline points="16 17 21 12 16 7"/>
                                    <line x1="21" y1="12" x2="9" y2="12"/>
                                </svg>
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/about" 
                                className="mobile-menu-item"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About
                            </Link>
                            <Link 
                                to="/contact" 
                                className="mobile-menu-item"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>
                            <div className="mobile-menu-divider"></div>
                            <Link 
                                to="/login" 
                                className="mobile-menu-item"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/signup" 
                                className="mobile-menu-item mobile-cta"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;