import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash, FaGithub, FaFacebookF } from 'react-icons/fa';
import picture from '../../assests/photo/login-image.png';
import { Link, useNavigate } from 'react-router-dom';
// use context for auth
import { toast } from 'react-toastify';
import { useAuth } from '@/firebase/AuthProvider';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signInUser } = useAuth(); // email/password login
  const { signInWithGoogle, signInWithGithub } = useAuth(); // Google login from context (optional)

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInUser(email, password);
      toast.success('✅ Login successful');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      alert(`Welcome ${user.displayName || user.email}`);
      navigate('/dashboard');
    } catch (error: any) {
      alert(`Google login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const user = await signInWithGithub();
      alert(`Welcome ${user.displayName || user.email}`);
    } catch (error) {
      alert('GitHub login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col lg:flex-row bg-white rounded-xl overflow-hidden max-w-4xl w-full">
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <h1 className="text-3xl font-bold mb-5">Welcome ShelfShare</h1>

          <div className="mb-8">
            <h1 className="text-xl font-bold mb-2">Login to Your Account!</h1>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="text-gray-600 text-sm">Email</label>
              <input
                type="email"
                placeholder="john.doe@gmail.com"
                className="w-full mt-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <label className="text-gray-600 text-sm">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                className="w-full mt-1 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute mt-3 right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
              <label>
                <input type="checkbox" className="mr-2" />
                Remember me
              </label>
              <a href="/forget" className="text-red-500">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-500 transition disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-4">
            Don’t have an account?{' '}
            <Link to="/register" className="text-red-500 font-semibold">
              Sign up
            </Link>
          </p>

          <div className="mt-6 text-center text-gray-400 text-sm relative">
            <span className="bg-white px-2 relative z-10">Or login with</span>
            <hr className="absolute top-1/2 left-0 w-full border-gray-300 -z-0" />
          </div>

          <div className="mt-4 flex justify-center gap-4">
            <button
              type="button"
              className="border border-gray-300 rounded p-2 hover:bg-gray-100 transition"
            >
              <FaFacebookF />
            </button>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="border border-gray-300 rounded p-2 hover:bg-gray-100 transition"
            >
              <FcGoogle />
            </button>
            <button
              onClick={handleGithubLogin}
              type="button"
              className="border border-gray-300 rounded p-2 hover:bg-gray-100 transition"
            >
              <FaGithub />
            </button>
          </div>
        </div>

        <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gray-100">
          <img
            src={picture}
            alt="Login Illustration"
            className="w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
