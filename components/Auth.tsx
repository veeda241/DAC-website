
import React, { useState } from 'react';
import { User } from '../types';
import { LOGO_URL } from '../constants';

interface AuthProps {
  users: User[];
  onLogin: (user: User) => void;
  onRegister: (name: string, email: string) => void;
  onCancel: () => void;
}

const Auth: React.FC<AuthProps> = ({ users, onLogin, onRegister, onCancel }) => {
  const [isSignUp, setIsSignUp] = useState(false);
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
        // Special check for the initial admin account purely for simulation if desired, 
        // but now we rely on the database role.
        if (password.trim().length > 0) {
           // Simple check to ensure the admin knows their password if it's the admin account
           if (foundUser.email === 'vyas.sk17@gmail.com' && password !== 'admin123') {
             setError('Invalid credentials.');
             return;
           }
           onLogin(foundUser);
        } else {
          setError('Please enter your password.');
        }
      } else {
        setError('Account not found. Please sign up first.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-8 rounded-2xl shadow-2xl relative">
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
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
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

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-transform hover:scale-[1.02] shadow-lg shadow-indigo-500/20">
            {isSignUp ? 'Create Account' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
           <button 
             type="button"
             onClick={() => {
               setIsSignUp(!isSignUp);
               setError('');
               setEmail('');
               setPassword('');
               setName('');
             }}
             className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
           >
             {isSignUp ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
           </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
