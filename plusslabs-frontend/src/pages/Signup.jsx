import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";

const Signup = () => {
  const [data, setData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const response = await axios.post("http://localhost:3000/api/users", data);
      console.log("Signup successful:", response.data);
      
      // After successful signup, automatically login
      const loginResponse = await axios.post("http://localhost:3000/api/auth", {
        email: data.email,
        password: data.password
      });

      localStorage.setItem("user", JSON.stringify({
        token: loginResponse.data.data,
        role: loginResponse.data.role
      }));

      navigate("/"); // Redirect to home page
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
      console.error("Signup error:", error.response?.data);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/google", {
        credential: credentialResponse.credential,
        isSignup: true
      });
      // After Google signup, automatically log them in
      localStorage.setItem("user", JSON.stringify({
        token: res.data.token,
        ...res.data.user
      }));
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Google signup failed:", error.response?.data?.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-xl font-bold mb-4">Create Account</h1>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
        <input className="border p-2 w-full mb-3" type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
        <input className="border p-2 w-full mb-3" type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
        <input className="border p-2 w-full mb-3" type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input className="border p-2 w-full mb-3" type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md w-full mb-4">Sign Up</button>
        
        <div className="relative flex py-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.error("Google Sign Up was unsuccessful")}
            theme="outline"
            size="large"
            text="signup_with"
            shape="rectangular"
          />
        </div>
      </form>
    </div>
  );
};

export default Signup;
