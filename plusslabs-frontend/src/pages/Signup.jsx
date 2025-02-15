import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { API_BASE_URL } from "../config";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // try {
    //   const res = await axios.post("http://localhost:3000/api/auth/signup", formData);
    //   localStorage.setItem("token", res.data.token);
    //   alert("Signup Successful!");
    //   navigate("/dashboard");
    // } catch (err) {
    //   setError(err.response?.data?.msg || "Signup failed");
    // }

    try {
      const res = await axios.post(API_BASE_URL, formData);
      localStorage.setItem("token", res.data.token);
      alert("Signup Successful!");
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
      console.log('Error signing up:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="w-full p-2 border rounded-md" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border rounded-md" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 border rounded-md" />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Sign Up</button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account? <a href="/login" className="text-blue-500">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
