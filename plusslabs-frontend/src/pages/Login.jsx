import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import axios from "axios";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const res = await axios.post("http://localhost:3000/api/auth", data);
      
      if (res.data.data) {
        localStorage.setItem("user", JSON.stringify({
          token: res.data.data,
          role: res.data.role
        }));
        navigate("/"); // Redirect to home page
      } else {
        setError("Login failed - Invalid response from server");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      console.error("Login error:", error.response?.data);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/google", {
        credential: credentialResponse.credential
      });
      localStorage.setItem("user", JSON.stringify({
        token: res.data.token,
        ...res.data.user
      }));
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Google login failed:", error.response?.data?.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-xl font-bold mb-4">Login</h1>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">{error}</div>}
        <input className="border p-2 w-full mb-3" type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input className="border p-2 w-full mb-3" type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md w-full mb-4">Login</button>
        
        <div className="relative flex py-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.error("Google Sign In was unsuccessful")}
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
          />
        </div>
      </form>
    </div>
  );
};

export default Login;


