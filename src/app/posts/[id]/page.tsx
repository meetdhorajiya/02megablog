'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string; // ✅ Add imageUrl to the post interface
  author: { _id: string; username: string };
  createdAt: string;
  status: 'public' | 'private';
}

interface UserToken {
  id: string;
}

export default function SinglePostPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const response = await axios.get(`/api/posts/${id}`, { headers });
        const fetchedPost = response.data;
        setPost(fetchedPost);

        if (token) {
          const decodedToken = jwtDecode<UserToken>(token);
          if (decodedToken.id === fetchedPost.author._id) {
            setIsAuthor(true);
          }
        }
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Could not fetch post.");
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, router]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Post deleted successfully.");
      router.push('/my-posts');
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete post.");
    }
  };

  const formattedDate = post ? new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) : '';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-gray-400 p-10">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-red-400 p-10 bg-gray-800 rounded-lg">Post not found or access denied.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
            &larr; Back to feed
          </Link>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
          <div className="p-8 sm:p-10">

            {/* ✅ IMAGE SECTION */}
            {post.imageUrl && (
              <div className="mb-6">
                <img
                  src={post.imageUrl}
                  alt="Post image"
                  className="w-full max-h-[500px] object-cover rounded-lg border border-gray-700"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">{post.title}</h1>
              <span className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full ${post.status === 'private' ? 'bg-purple-600/50 text-purple-300' : 'bg-green-600/50 text-green-300'}`}>
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </span>
            </div>

            <div className="text-sm text-gray-400 mb-8 border-b border-gray-700 pb-4">
              By <span className="font-semibold text-cyan-400">{post.author.username}</span>
              <span className="mx-2">·</span>
              <span>{formattedDate}</span>
            </div>

            <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>

            {isAuthor && (
              <div className="mt-10 pt-6 border-t border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">Author Controls</h3>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleDelete}
                    className="px-5 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}