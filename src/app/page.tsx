'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: {
    username: string;
  };
  createdAt: string;
  status: 'public' | 'private';
}

const PostCard = ({ post }: { post: Post }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
        {post.imageUrl && (
            <div className="w-full h-48 overflow-hidden">
                <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
            </div>
        )}
        <div className="p-6 flex-grow">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{post.title}</h3>
                {post.status && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${post.status === 'private' ? 'bg-purple-600/50 text-purple-300' : 'bg-green-600/50 text-green-300'}`}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                )}
            </div>
            <p className="text-gray-400 mb-4 line-clamp-2 text-sm">{post.content}</p>
        </div>
        <div className="border-t border-gray-700 mt-auto px-6 py-4 flex justify-between items-center text-sm text-gray-500">
            <span>By <span className="font-medium text-cyan-400">{post.author.username}</span></span>
            <Link href={`/posts/${post._id}`} className="text-blue-400 hover:text-blue-300 font-semibold">
                Read More &rarr;
            </Link>
        </div>
    </div>
);


export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchPosts();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Could not fetch posts.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse [animation-delay:0.2s]"></div>
                <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse [animation-delay:0.4s]"></div>
                <span className="text-lg text-gray-400">Loading Content...</span>
            </div>
        </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gray-900 text-white">
       {isLoggedIn ? (
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Community Feed
          </h1>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
             <div className="text-center py-16 px-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-lg">No public posts yet. Why not create one?</p>
             </div>
          )}
        </div>
      ) : (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden p-4">
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] bg-radial-gradient(circle, rgba(22, 163, 74, 0.2), transparent 60%)"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[50rem] h-[50rem] bg-radial-gradient(circle, rgba(37, 99, 235, 0.2), transparent 60%)"></div>

            <div className="relative z-10 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                    Discover Nexus
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
                    A modern platform to share your ideas, connect with others, and explore a universe of stories. Your next great discovery awaits.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                    <Link href="/login" className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg shadow-lg hover:shadow-cyan-500/30 hover:scale-105 transform transition-all duration-300">
                        Get Started
                    </Link>
                    <Link href="/signup" className="px-8 py-4 rounded-full bg-gray-700 text-gray-200 font-bold text-lg shadow-lg hover:bg-gray-600 hover:scale-105 transform transition-all duration-300">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
      )}
    </main>
  );
}