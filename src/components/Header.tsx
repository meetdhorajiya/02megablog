'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';

interface UserToken {
  username: string;
}

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<UserToken | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // This effect runs on the client to determine auth state
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<UserToken>(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <header className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Nexus
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
                <Link href="/my-posts" className="text-gray-300 hover:text-white transition-colors">My Posts</Link>
                <Link href="/add-post" className="text-gray-300 hover:text-white transition-colors">Add Post</Link>
                <div className="flex items-center space-x-4">
                  <Link href="/profile" className="px-4 py-2 rounded-full bg-gray-700 text-white font-semibold hover:bg-gray-600 transition-colors">
                    {user.username}
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="px-5 py-2 rounded-full bg-gray-600 text-white font-semibold hover:bg-gray-500 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu button */}
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Home</Link>
                <Link href="/my-posts" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">My Posts</Link>
                <Link href="/add-post" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Add Post</Link>
                <div className="border-t border-gray-700 my-2"></div>
                <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-gray-700">{user.username}'s Profile</Link>
                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-white hover:bg-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600">Login</Link>
                <Link href="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}