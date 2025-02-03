import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authServices';
import { ToastContainer, toast } from 'react-toastify';

const Register = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    //will register a user based on the provided credentials
    //NEED MORE COMPREHENSIVE ERROR MESSAGES WHEN FAILED REGISTRATION
    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!strongPasswordRegex.test(password)) {
        toast.error('Password must be at least 6 characters long, contain an uppercase letter, a number, and a special character.', {toastId: '8'});
        return;
      }
  
      try {
        await registerUser(username, email, password);
        toast.success('Registration successful', {toastId: '7'})
        navigate('/login')
      } catch (error) {
        console.error(error);
        toast.error('Registration failed', {toastId: '6'});
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
            <h2 className="text-2xl font-semibold text-slate-50 mb-6 text-center">Register</h2>
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-slate-100 text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-400 border border-slate-300 text-slate-100 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Email Field */}
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

              {/* Password Field*/}
              <div>
                <label className="block text-slate-100 text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-slate-400 border border-slate-300 text-slate-100 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Register
              </button>
            </form>
          </div>
        </div>
    );
}
    
export default Register;
