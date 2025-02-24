import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authServices';
import { useUserContext } from '../context/authContextProvider';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { checkAuthUser } = useUserContext();

  console.log("Node ENV:", import.meta.env.VITE_NODE_ENV)

  //Will log the user in once valid credentials have been provided
  //NEED TO INCLUDE MORE COMPREHENSIVE FAILED LOGIN MESSAGES
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await loginUser(email, password);
      //axios.defaults.withCredentials = true;
      await checkAuthUser();
      navigate('/posts');
    } catch (error) {
      console.error(error);
      toast.error('Login failed', {toastId: '5'});
    }
  };

  return (
    <div className="min-h-screen bg-slate-600 flex items-start justify-center py-44">

      <ToastContainer 
        position="top-center"
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />

      <div className="bg-slate-500 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-slate-50 mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Field*/}
          <div>
            <label className="block text-slate-100 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-slate-400 border border-slate-300 text-slate-100 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-slate-100 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete='current-password'
              className="w-full px-4 py-2 rounded-lg bg-slate-400 border border-slate-300 text-slate-100 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <p className="mt-4">
          Don't have an account. Register
          <Link 
            to="/register" 
            className="ml-1 text-white hover:text-gray-300 font-semibold underline"
          >
            Here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;