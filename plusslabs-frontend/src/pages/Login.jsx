// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/api/auth/login', { email, password });
//       if (response.status === 200) {
//         navigate('/');
//       }
//     } catch (error) {
//       console.error('Error logging in:', error);
//     }
//   };

//   return (
//     <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
//       <h1 className='text-2xl font-bold mb-4'>Login</h1>
//       <form className='bg-white p-6 rounded shadow-md w-full max-w-sm' onSubmit={handleSubmit}>
//         <div className='mb-4'>
//           <label className='block text-gray-700'>Email</label>
//           <input
//             type='email'
//             className='w-full p-2 border border-gray-300 rounded mt-1'
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <div className='mb-4'>
//           <label className='block text-gray-700'>Password</label>
//           <input
//             type='password'
//             className='w-full p-2 border border-gray-300 rounded mt-1'
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>
//         <button type='submit' className='w-full bg-blue-500 text-white p-2 rounded'>Login</button>
//       </form>
//       <p className='mt-4'>
//         Don't have an account? <Link to='/signup' className='text-blue-500'>Signup</Link>
//       </p>
//     </div>
//   );
// };

// export default Login;






import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // try {
    //   const res = await axios.post("http://localhost:3000/api/auth/login", formData);
    //   localStorage.setItem("token", res.data.token);
    //   alert("Login Successful!");
    //   navigate("/dashboard");
    // } catch (err) {
    //   setError(err.response?.data?.msg || "Login failed");
    // }

    try {
      const res = await axios.post(API_BASE_URL, formData);
      localStorage.setItem("token", res.data.token);
      alert("Login Successful!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded-md" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 border rounded-md" />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Login</button>
        </form>
        <p className="text-sm text-center mt-4">
          Don't have an account? <a href="/signup" className="text-blue-500">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
