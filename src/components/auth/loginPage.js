import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './authStyle.css';
import logo from "../../resources/cropLogo.png"


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage and navigate to home
        localStorage.setItem('token', data.token);
        navigate('/home'); // Redirect to home after successful login
      } else {
        setError(data.message); // Show error message
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const handleSignUpRedirect = () => {
    navigate('/signup'); // Navigate to the Sign Up page
  };

  return (
    <div className="container-log">
      <div className="form-container">
        <img src={logo} alt='logo' width={275} height={50}/>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className='form'>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div className="signup-option">
          <p>Don't have an account? 
            <button onClick={handleSignUpRedirect} className="signup-button">Sign Up</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;






