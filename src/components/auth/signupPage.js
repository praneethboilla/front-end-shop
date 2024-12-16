import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './authStyle.css';
import logo from "../../resources/cropLogo.png"

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call your signup API
    try {
      const response = await fetch('/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login page after successful sign-up
        navigate('/login');
      } else {
        setError(data.message); // Show error message
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="container-log">
      <div className="form-container">
         <img src={logo} alt='logo' width={275} height={50} />
        <h2>Sign Up</h2>
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
          <button type="submit" >Sign Up</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default Signup;

