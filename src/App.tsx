import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { AuthProvider } from './context/authContextProvider.tsx';
import { NavBar } from './components/navigationBar.tsx';
import Homepage from './pages/Homepage.tsx';
import Register from './pages/Register.tsx';
import Login from './pages/Login.tsx';
import CreatePost from './pages/CreatePost.tsx';
import YourPost from './pages/YourPost.tsx';

import './App.css'

axios.defaults.baseURL = 'http://localhost:3001';
axios.defaults.withCredentials = true;

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/createPost" element={<CreatePost />} />
          <Route path="/yourPost" element={<YourPost />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App
