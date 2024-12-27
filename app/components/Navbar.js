'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

const Navbar = ({ currentPage }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter(); // Initialize router for programmatic navigation

  // // Logout Function
  // const handleLogout = async () => {
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_USER_SERVICE_URL}/api/users/logout`, {
  //       method: 'POST',
  //       credentials: 'include', // Include cookies for authentication
  //     });

  //     if (response.ok) {
  //       router.push('/login'); // Redirect to the login page
  //     } else {
  //       throw new Error('Logout failed');
  //     }
  //   } catch (error) {
  //     setError('Failed to logout');
  //   }
  // };

  const handleLogout = () => {
    sessionStorage.removeItem('authToken'); // Clear token from session storage
    router.push('/'); // Redirect to the login page
  };
  
  // // Fetch user data from cookie (JWT token)
  // const fetchUserDataFromCookie = () => {
  //   try {
  //     const token = document.cookie
  //       .split('; ')
  //       .find((row) => row.startsWith('token='))
  //       ?.split('=')[1];

  //     if (token) {
  //       const decodedToken = JSON.parse(atob(token.split('.')[1]));
  //       setUser({ id: decodedToken.id, username: decodedToken.email });
  //       console.log('Decoded token:', decodedToken.id, decodedToken.email);
  //     } else {
  //       setError('Token not found');
  //     }
  //   } catch (error) {
  //     setError('Failed to parse user data from token');
  //   }
  // };

  const fetchUserDataFromSession = () => {
    try {
      const token = sessionStorage.getItem('authToken'); // Retrieve token from session storage
  
      if (token) {
        // Decode the JWT payload (base64-decode)
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: decodedToken.id, username: decodedToken.email }); // Update the user state
      } else {
        setError('Token not found in session storage');
      }
    } catch (error) {
      setError('Failed to parse user data from token');
    }
  };
  

  useEffect(() => {
    fetchUserDataFromSession();
  }, []);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Navigation Links */}
          <div className="flex items-center space-x-7">
            <Link
              href="/dashboard"
              className={`font-semibold  ${
                currentPage == 'dashboard' 
                ? 'text-xl text-blue-600' : 'text-lg text-gray-500 hover:text-blue-400 hover:scale-105 transition-transform duration-300'
            }`}
            >
              Dashboard
            </Link>
            <Link
              href={{
                pathname: '/logs',
                query: { id: user?.id },
              }}
              className={`py-2 px-2 font-semibold  ${
                currentPage == 'logs'
                  ? 'text-xl text-blue-600' : 'text-lg text-gray-500 hover:text-blue-400 hover:scale-105 transition-transform duration-300'
              }`}
            >
              Logs
            </Link>
            <Link
              href={{
                pathname: '/profile',
                query: { id: user?.id },
              }}
              className={`py-2 px-2 font-semibold   ${
                currentPage == 'profile'
                  ? 'text-xl text-blue-600' : 'text-lg text-gray-500 hover:text-blue-400 hover:scale-105 transition-transform duration-300'
              }`}
            >
              Profile
            </Link>
          </div>

          {/* Logout Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogout} // Directly use the logout function
              className="py-2 px-2 font-medium text-white bg-blue-500 rounded hover:bg-blue-400 transition duration-300"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
