'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
    _id: string;
    username: string;
    email: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error("Please login to view your profile.");
                router.push('/login');
                return;
            }

            try {
                const response = await axios.get('/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data.data);
            } catch (error) {
                toast.error("Session expired. Please login again.");
                localStorage.removeItem('token');
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    if (loading) {
        return <div className="text-center text-gray-400 p-10">Loading profile...</div>;
    }

    if (!user) {
        return <div className="text-center text-red-400 p-10">Could not load user data.</div>;
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 flex items-center justify-center">
            <div className="w-full max-w-lg bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-5xl font-bold shadow-lg">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                    <p className="text-gray-400">{user.email}</p>
                </div>

                <div className="my-8 border-t border-gray-700"></div>

                <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center bg-gray-700/50 p-4 rounded-lg">
                        <span className="font-medium text-gray-300">User ID</span>
                        <span className="text-gray-400 font-mono select-all">{user._id}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-700/50 p-4 rounded-lg">
                        <span className="font-medium text-gray-300">Account Status</span>
                        <span className="px-3 py-1 font-semibold text-green-300 bg-green-800/50 rounded-full">
                           Active
                        </span>
                    </div>
                </div>

                 <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link href="/my-posts" className="flex-1 text-center py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300">
                        View My Posts
                    </Link>
                    <Link href="/add-post" className="flex-1 text-center py-3 px-4 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300">
                        Create a Post
                    </Link>
                </div>
            </div>
        </div>
    );
}