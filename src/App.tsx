import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import AuthProvider from './context/authContextProvider.tsx';
import { NavBar } from './components/navigationBar.tsx';
import Homepage from './pages/Homepage.tsx';
import Register from './pages/Register.tsx';
import Login from './pages/Login.tsx';
import CreatePost from './pages/CreatePost.tsx';
import YourPost from './pages/YourPost.tsx';
import { QueryClient, QueryClientProvider } from 'react-query';

import './App.css'
import Profile from './pages/Profile.tsx';
import EditPlatforms from './pages/EditPlatforms.tsx';
import RootLayout from './pages/RootLayout.tsx';
import AuthLayout from './pages/AuthLayout.tsx';
import AcceptedPosts from './pages/AcceptedPosts.tsx';
import EditPost from './pages/EditPost.tsx';

axios.defaults.baseURL = 'http://localhost:3001';
//console.log(process.env.REACT_APP_URL)
axios.defaults.withCredentials = true;

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NavBar />
          <Routes>
            
            {/* Public Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Home is not in either because it can be accessed whether logged in or not */}
            <Route path="/" element={<Homepage />} />

            {/* Protected Routes */}
            <Route element={<RootLayout />}>
              <Route path="/createPost" element={<CreatePost />} />
              <Route path="/editPost" element={<EditPost />} />
              <Route path="/yourPost" element={<YourPost />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/editPlatforms" element={<EditPlatforms />} />
              <Route path="/acceptedPosts" element={<AcceptedPosts />} />
            </Route>
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App
