import { Link } from 'react-router-dom';
import { useUserContext } from '../context/authContextProvider';
import { useWebSocket } from '../context/webSocketContext';
import { useEffect, useState } from 'react';

export const NavBar = () => {
    const { isAuthenticated, logout }  = useUserContext();
    const {newMessage: received} = useWebSocket();
    const [acceptedPostsNotifications, setAcceptedPostsNotifications] = useState<number>(0);
    const [yourPostNotifications, setYourPostNotifications] = useState<number>(0)

    useEffect(() => {
        setAcceptedPostsNotifications(0);
        setYourPostNotifications(0);
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (key && key.startsWith('acceptedPosts')) {
                const value = localStorage.getItem(key);
                setAcceptedPostsNotifications(prev => prev + Number(value));
            } else if (key && key.startsWith('yourPost')) {
                const value = localStorage.getItem(key);
                setYourPostNotifications(prev => prev + Number(value));
            }
        }
    }, [received])
   
    return (
        <nav className="bg-slate-800 text-white py-4 shadow-md rounded-md mb-5 hidden min-[550px]:block w-fit justify-self-center">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                {/* Logo or Brand */}
                {/* <div className="text-2xl font-semibold">
                    
                </div> */}

                {/* Navigation Links */}
                <div className="space-x-6 flex items-center justify-end w-full">
                    {/* Links for unauthenticated users */}
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="hover:text-gray-400 transition-colors duration-300">Login</Link>
                            <Link to="/register" className="hover:text-gray-400 transition-colors duration-300">Register</Link>
                        </>
                        ) : (
                        <>
                        {/* Links for authenticated users */}
                            <Link to={isAuthenticated ? "/posts" : "/"} className="hover:text-gray-400 transition-colors duration-300">
                                Home
                            </Link>
                            <Link to="/createPost" className="hover:text-gray-400 transition-colors duration-300">Create Post</Link>
                            <Link to="/yourPost" className="hover:text-gray-400 transition-colors duration-300">
                                Your Post
                                <span className="top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5">{yourPostNotifications}</span>
                            </Link>
                            <Link to="/acceptedPosts" className="hover:text-gray-400 transition-colors duration-300">
                                Accepted Posts
                                <span className="top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5">{acceptedPostsNotifications}</span>
                            </Link>
                            <Link to="/profile" className="hover:text-gray-400 transition-colors duration-300">Profile</Link>
                            <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors duration-300">Logout</button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}