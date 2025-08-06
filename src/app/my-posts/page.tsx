'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: { username: string };
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
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${post.status === 'private' ? 'bg-purple-600/50 text-purple-300' : 'bg-green-600/50 text-green-300'}`}>
                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                </span>
            </div>
            <p className="text-gray-400 mb-4 line-clamp-3">{post.content}</p>
        </div>
        <div className="border-t border-gray-700 pt-4 flex justify-between items-center text-sm text-gray-500 mt-auto px-6 py-4">
            <span>By <span className="font-medium text-cyan-400">{post.author.username}</span></span>
            <Link href={`/posts/${post._id}`} className="text-blue-400 hover:text-blue-300 font-semibold">
                View Details &rarr;
            </Link>
        </div>
    </div>
);

export default function MyPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please log in to view your posts.");
        router.push('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get('/api/posts/my-posts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(response.data);
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Could not fetch your posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [router]);

  if (loading) {
    return <div className="text-center text-gray-400 p-10">Loading your posts...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-4xl font-bold text-white bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">My Posts</h1>
                <Link href="/add-post" className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg">
                    Create New Post
                </Link>
            </div>

            {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                ))}
                </div>
            ) : (
                <div className="text-center py-20 px-4 bg-gray-800 rounded-lg shadow-inner border border-gray-700">
                    <h3 className="text-2xl font-semibold text-white mb-2">Your canvas is empty.</h3>
                    <p className="text-gray-400 mb-6">It looks like you haven't created any posts. Let's change that!</p>
                    <Link href="/add-post" className="inline-block px-8 py-3 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold hover:scale-105 transition-transform">
                        Create Your First Post
                    </Link>
                </div>
            )}
        </div>
    </div>
  );
}