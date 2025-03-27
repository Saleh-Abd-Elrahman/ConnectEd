import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { registerUser } from '../services/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  // In a real app, this would be verified with proper auth
  // For demo purposes, we'll use demo accounts
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(null);
      setLoading(true);
      
      // For demo purposes, use a predefined student account
      const demoEmail = 'alex.johnson@university.edu';
      const demoPassword = 'password123';
      
      // Try to login with the demo credentials
      const user = await login(demoEmail, demoPassword).catch(async () => {
        // If login fails, it might be because the demo account doesn't exist yet
        // Create the student account (firebase only, actual DB seeding happens separately)
        await registerUser(demoEmail, demoPassword, 'Alex Johnson', 'student');
        
        // Try logging in again after registration
        return await login(demoEmail, demoPassword);
      });
      
      // Navigate based on user role
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfessorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(null);
      setLoading(true);
      
      // For demo purposes, use a predefined professor account
      const demoEmail = 'sarah.chen@university.edu';
      const demoPassword = 'password123';
      
      // Try to login with the demo credentials
      const user = await login(demoEmail, demoPassword).catch(async () => {
        // If login fails, it might be because the demo account doesn't exist yet
        // Create the professor account (firebase only, actual DB seeding happens separately)
        await registerUser(demoEmail, demoPassword, 'Professor Sarah Chen', 'professor');
        
        // Try logging in again after registration
        return await login(demoEmail, demoPassword);
      });
      
      // Navigate based on user role
      navigate('/professor/home');
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(circle at center, #7A9BB2 0%,rgb(110, 145, 177) 35%,rgb(57, 76, 97) 70%),
          radial-gradient(circle at top right, transparent 20%, rgba(0,0,0,0.4) 70%),
          radial-gradient(circle at bottom left, transparent 30%, rgba(0,0,0,0.4) 70%)
        `
      }}></div>
      <div className="max-w-md w-full space-y-8 p-8 bg-black/5 backdrop-blur-sm rounded-lg shadow-xl relative z-10">
        <div className="flex flex-col items-center">
          <GraduationCap className="w-16 h-16 text-white mb-4" />
          <div className="text-center">
            <span className="text-[#00A3FF] text-4xl font-bold">ie</span>
            <p className="text-white text-xl mt-1">UNIVERSITY</p>
          </div>
        </div>

        <div className="mt-12 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 bg-black/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-[#00A3FF] backdrop-blur-sm"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-black/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-[#00A3FF] backdrop-blur-sm"
            />
          </div>

          <div className="text-center">
            <a href="#" className="text-gray-300 hover:text-[#00A3FF] text-sm">
              Forgot Password?
            </a>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleStudentLogin}
              disabled={loading}
              className="w-full py-3 px-4 bg-black/20 text-white rounded-full hover:bg-black/30 transition-all duration-200 backdrop-blur-sm disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login as Student'}
            </button>
            <button
              onClick={handleProfessorLogin}
              disabled={loading}
              className="w-full py-3 px-4 bg-[#00A3FF] text-white rounded-full hover:bg-[#0088FF] transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login as Professor'}
            </button>
          </div>
          
          <div className="text-center text-white/70 text-sm">
            <p>For demo purposes, click any button to login with pre-configured credentials.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;