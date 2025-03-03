import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import AuthProvider from './context/authContextProvider.tsx';
import { NavBar } from './components/navigationBar.tsx';
import Register from './pages/Register.tsx';
import Login from './pages/Login.tsx';
import Posts from './pages/Posts.tsx';
import CreatePost from './pages/CreatePost.tsx';
import YourPost from './pages/YourPost.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './App.css'
import Profile from './pages/Profile.tsx';
import EditPlatforms from './pages/EditPlatforms.tsx';
import RootLayout from './pages/RootLayout.tsx';
import AuthLayout from './pages/AuthLayout.tsx';
import AcceptedPosts from './pages/AcceptedPosts.tsx';
import EditPost from './pages/EditPost.tsx';
import { WebSocketProvider } from './context/webSocketContext.tsx';
import Homepage from './pages/HomePage.tsx';

axios.defaults.baseURL = import.meta.env.VITE_NODE_ENV === 'production' ? import.meta.env.VITE_APP_API_URL : 'http://localhost:3001/api/';
axios.defaults.withCredentials = true;

// console.log("NODE_ENV:", import.meta.env.VITE_NODE_ENV);
// console.log("API_URL:", import.meta.env.VITE_APP_API_URL);
// console.log("Socket_URL:", import.meta.env.VITE_SOCKET_URL);

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WebSocketProvider>
            <NavBar />
            <Routes>
              
              {/* Public Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/" element={<Homepage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
              </Route>
              
              
              {/* Protected Routes */}
              <Route element={<RootLayout />}>
                <Route path="/posts" element={<Posts />} />
                <Route path="/createPost" element={<CreatePost />} />
                <Route path="/editPost" element={<EditPost />} />
                <Route path="/yourPost" element={<YourPost />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/editPlatforms" element={<EditPlatforms />} />
                <Route path="/acceptedPosts" element={<AcceptedPosts />} />
              </Route>
            </Routes>
          </WebSocketProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App
