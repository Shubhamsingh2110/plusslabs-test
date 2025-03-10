// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);

//   // Check if user is logged in
//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     setIsLoggedIn(!!user);
//   }, []);

//   // Logout Function
//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setIsLoggedIn(false);
//     setShowDropdown(false);
//     navigate("/login");
//   };

//   return (
//     <nav className="bg-blue-500 p-4 shadow-md">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link to="/" className="text-white text-xl font-bold">
//           PlusSlabs
//         </Link>

//         <div className="flex items-center space-x-4">
//           {/* If user is NOT logged in, show Login & Signup */}
//           {!isLoggedIn ? (
//             <>
//               <Link to="/login" className="text-white px-4 py-2 bg-green-500 rounded hover:bg-green-600">
//                 Login
//               </Link>
//               <Link to="/signup" className="text-white px-4 py-2 bg-gray-700 rounded hover:bg-gray-800">
//                 Signup
//               </Link>
//             </>
//           ) : (
//             /* If user is logged in, show Profile Button */
//             <div className="relative">
//               <button
//                 className="text-white px-4 py-2 bg-gray-700 rounded hover:bg-gray-800"
//                 onClick={() => setShowDropdown(!showDropdown)}
//               >
//                 Profile
//               </button>

//               {/* Dropdown Menu */}
//               {showDropdown && (
//                 <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
//                   <Link
//                     to="/dashboard"
//                     className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
//                     onClick={() => setShowDropdown(false)}
//                   >
//                     Dashboard
//                   </Link>
//                   <button
//                     className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Fetch updated user info every time the navbar loads
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Update state with the latest role
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">PlusSlabs</Link>

        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="/login" className="text-white px-4 py-2 bg-green-500 rounded hover:bg-green-600">Login</Link>
              <Link to="/signup" className="text-white px-4 py-2 bg-gray-700 rounded hover:bg-gray-800">Signup</Link>
            </>
          ) : (
            <div className="relative">
              <button className="text-white px-4 py-2 bg-gray-700 rounded hover:bg-gray-800" onClick={() => setShowDropdown(!showDropdown)}>
                Profile
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
                  {user.role === "admin" && (
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={() => setShowDropdown(false)}>
                      Dashboard
                    </Link>
                  )}
                  <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


