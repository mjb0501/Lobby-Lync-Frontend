import { useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { Link } from 'react-router-dom';

export const NavBar = () => {
    const { auth, logout } = useContext(AuthContext);
  
    return (
        <nav className="bg-slate-600 text-white py-4 shadow-md">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                {/* Logo or Brand */}
                <div className="text-2xl font-semibold">
                    <Link to="/" className="hover:text-gray-400 transition-colors duration-300">
                        Home
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="space-x-6 flex items-center">
                    {/* Links for unauthenticated users */}
                    {!auth ? (
                        <>
                            <Link to="/login" className="hover:text-gray-400 transition-colors duration-300">Login</Link>
                            <Link to="/register" className="hover:text-gray-400 transition-colors duration-300">Register</Link>
                        </>
                        ) : (
                        <>
                        {/* Links for authenticated users */}
                            <Link to="/createPost" className="hover:text-gray-400 transition-colors duration-300">Create Post</Link>
                            <Link to="/yourPost" className="hover:text-gray-400 transition-colors duration-300">Your Post</Link>
                            <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors duration-300">Logout</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}