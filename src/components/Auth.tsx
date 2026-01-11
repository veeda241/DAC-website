
import React, { useState } from 'react';
import { User } from '../types';
import { LOGO_URL } from '../constants';

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
      <div className="bg-[#0A0A0A]/90 border border-white/10 w-full max-w-md p-8 rounded-2xl shadow-2xl relative backdrop-blur-xl">
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">✕</button>

        <div className="text-center mb-8">
          <img src={LOGO_URL} alt="Logo" className="w-16 h-16 mx-auto mb-4 object-contain" />
          <h2 className="text-3xl font-bold text-white mb-2">
            {isSignUp ? 'Join the Club' : 'Portal Login'}
          </h2>
          <p className="text-slate-400">
            {isSignUp ? 'Create your Data Analytics Club account.' : 'Access your dashboard.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <label className="block text-sm text-slate-400 mb-2">Full Name</label>
              <input
                type="text"
                required={isSignUp}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-slate-400 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center animate-pulse">{error}</div>}

          <button type="submit" className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg transition-transform hover:scale-[1.02] shadow-lg shadow-cyan-500/20">
            {isSignUp ? 'Create Account' : 'Login'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center space-y-4">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setEmail('');
              setPassword('');
              setName('');
            }}
            className="block w-full text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>

          {!isSignUp && (
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="text-xs text-slate-500 hover:text-slate-400 transition-colors"
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
