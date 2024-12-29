import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authServices';

const Register = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        await registerUser(username, email, password);
        navigate('/login');
      } catch (error) {
        console.error(error);
        alert('Registration failed!');
      }
    };
    
    return (
        <div>
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <div>
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Register</button>
          </form>
        </div>
    );
}
    
export default Register;
