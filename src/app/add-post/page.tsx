'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AddPostPage() {
    const router = useRouter();
    const [post, setPost] = useState({ title: '', content: '', status: 'public' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("You must be logged in to create a post.");
            router.push('/login');
        }
    }, [router]);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!post.title || !post.content) {
            toast.error("Title and content cannot be empty.");
            return;
        }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/posts', post, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Post created successfully!');
            router.push(`/my-posts`);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to create post.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-white text-center mb-8 bg-clip-text bg-gradient-to-r from-green-400 to-teal-500">Create a New Post</h1>
                <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleCreatePost} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="text-sm font-medium text-gray-300 block mb-2">
                                Post Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={post.title}
                                onChange={(e) => setPost({ ...post, title: e.target.value })}
                                placeholder="What's on your mind?"
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
                            />
                        </div>
                        <div>
                            <label htmlFor="content" className="text-sm font-medium text-gray-300 block mb-2">
                                Content
                            </label>
                            <textarea
                                id="content"
                                value={post.content}
                                onChange={(e) => setPost({ ...post, content: e.target.value })}
                                placeholder="Share your story..."
                                rows={8}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-300 block mb-2">Visibility</label>
                            <div className="flex items-center space-x-4 bg-gray-700 p-2 rounded-lg">
                                <button type="button" onClick={() => setPost({...post, status: 'public'})} className={`flex-1 py-2 text-center rounded-md transition-colors ${post.status === 'public' ? 'bg-green-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-600'}`}>
                                    Public
                                </button>
                                <button type="button" onClick={() => setPost({...post, status: 'private'})} className={`flex-1 py-2 text-center rounded-md transition-colors ${post.status === 'private' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-600'}`}>
                                    Private
                                </button>
                            </div>
                        </div>
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50"
                            >
                                {loading ? "Publishing..." : "Publish Post"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}