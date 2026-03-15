
import React, { useState } from 'react';
import { User } from '../types';
import { LOGO_URL } from '../constants';
import './Auth.css';

interface AuthProps {
  users: User[];
  onLogin: (user: User) => void;
  onRegister: (name: string, email: string) => void;
  onCancel: () => void;
  initialMode?: 'login' | 'register';
}

const Auth: React.FC<AuthProps> = ({ users, onLogin, onRegister, onCancel, initialMode = 'login' }) => {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      // --- SIGN UP LOGIC ---

      // 1. Check if user already exists
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        setError('User already exists. Please login.');
        return;
      }

      // 2. Register valid user
      if (name.trim() && email.trim() && password.trim()) {
        onRegister(name, email);
      } else {
        setError('All fields are required.');
      }

    } else {
      // --- LOGIN LOGIC ---

      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (foundUser) {
        // In a real app, we would hash and check password. 
        // For this demo, we accept the login if the user exists and password field is not empty.

        // Hardcoded check for the main admin account
        if (foundUser.email.toLowerCase() === 'vyas.sk17@gmail.com') {
          if (password === 'admin123') {
            onLogin(foundUser);
          } else {
            setError('Invalid password for admin account.');
          }
          return;
        }

        // For other users, just check if password is not empty
        if (password.trim().length > 0) {
          onLogin(foundUser);
        } else {
          setError('Please enter your password.');
        }
      } else {
        // Special case: if user types admin email but it's not in the list for some reason, 
        // we can check if it's the expected email and maybe auto-create or warn.
        if (email.toLowerCase() === 'vyas.sk17@gmail.com') {
          setError('Admin account not initialized. Please Sign Up as admin first.');
        } else {
          setError('Account not found. Please sign up first.');
        }
      }
    }
  };

  const handleDemoAdmin = () => {
    setEmail('vyas.sk17@gmail.com');
    setPassword('admin123');
    setIsSignUp(false);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]/80 backdrop-blur-md p-4 animate-fade-in-up">
      <div className="auth-form-area">
        <button onClick={onCancel} className="auth-close-btn">✕</button>

        {/* Logo & Title */}
        <div className="auth-header">
          <img src={LOGO_URL} alt="Logo" className="auth-logo" />
          <h2 className="auth-title">
            {isSignUp ? 'Join the Club' : 'Portal Login'}
          </h2>
          <p className="auth-subtitle">
            {isSignUp ? 'Create your Data Analytics Club account.' : 'Access your dashboard.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignUp && (
            <div className="auth-form-group">
              <label className="auth-label">Full Name</label>
              <input
                type="text"
                required={isSignUp}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-form-style"
                placeholder="John Doe"
              />
            </div>
          )}

          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-form-style"
              placeholder="you@example.com"
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-form-style"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="auth-error">{error}</div>
          )}

          <button type="submit" className="auth-btn">
            {isSignUp ? 'Create Account' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setEmail('');
              setPassword('');
              setName('');
            }}
            className="auth-link"
          >
            {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>

          {!isSignUp && (
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="auth-demo-btn"
            >
              Use Demo Admin Credentials
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
