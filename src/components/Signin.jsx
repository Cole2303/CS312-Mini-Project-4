import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const [formData, setFormData] = useState({ user_id: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/signin', formData);
      alert('Sign-in successful!');
      navigate('/'); // Redirect to the home page
    } catch (error) {
      alert(error.response?.data?.error || 'Error during sign-in');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      <label>User ID:</label>
      <input type="text" name="user_id" value={formData.user_id} onChange={handleChange} required />
      <label>Password:</label>
      <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      <button type="submit">Sign In</button>
    </form>
  );
};

export default Signin;
