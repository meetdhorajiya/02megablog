'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', user);
      toast.success('Login successful! Welcome back.');
      localStorage.setItem('token', response.data.token);
      window.location.href = '/profile';
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="w-full max-w-md">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 space-y-6 transform transition-all hover:scale-105 duration-500">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-gray-400 mt-2">Sign in to continue to Nexus</p>
                </div>
                <form onSubmit={onLogin} className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            placeholder="you@example.com"
                            required
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-200"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Logging In...' : 'Login'}
                    </button>
                </form>
                <div className="text-center text-gray-400">
                    Don't have an account?{' '}
                    <Link href="/signup" className="font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    </div>
  );
}