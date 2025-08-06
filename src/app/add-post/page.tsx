'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AddPostPage() {
    const router = useRouter();
    const [post, setPost] = useState({ title: '', content: '', status: 'public' });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("You must be logged in to create a post.");
            router.push('/login');
        }
    }, [router]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!post.title || !post.content) {
            toast.error("Title and content cannot be empty.");
            return;
        }
        if (!imageFile) {
            toast.error("An image is required for the post.");
            return;
        }
        
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('file', imageFile);
            const uploadResponse = await axios.post('/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (!uploadResponse.data.success) {
                throw new Error('Image upload failed.');
            }
            const imageUrl = uploadResponse.data.url;

            const token = localStorage.getItem('token');
            const postData = { ...post, imageUrl };
            
            await axios.post('/api/posts', postData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Post created successfully!');
            router.push(`/my-posts`);

        } catch (error: any) {
            console.error(error);
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
                            <label className="text-sm font-medium text-gray-300 block mb-2">
                                Post Image (Required)
                            </label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-600 px-6 py-10">
                                <div className="text-center">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Image preview" className="mx-auto h-48 w-auto rounded-lg object-cover"/>
                                    ) : (
                                        <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                    <div className="mt-4 flex text-sm leading-6 text-gray-400">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-gray-700 font-semibold text-cyan-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 hover:text-cyan-300 px-3 py-1">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} required />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="title" className="text-sm font-medium text-gray-300 block mb-2">
                                Post Title
                            </label>
                            <input id="title" type="text" value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} placeholder="What's on your mind?" className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200" />
                        </div>

                        <div>
                            <label htmlFor="content" className="text-sm font-medium text-gray-300 block mb-2">
                                Content
                            </label>
                            <textarea id="content" value={post.content} onChange={(e) => setPost({ ...post, content: e.target.value })} placeholder="Share your story..." rows={8} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200" />
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
                            <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-800 transition-all duration-300 disabled:opacity-50">
                                {loading ? "Publishing..." : "Publish Post"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}