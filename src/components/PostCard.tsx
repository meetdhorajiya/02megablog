import Link from "next/link";

// Define the structure of a Post object for TypeScript
interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
        username: string;
    };
    createdAt: string;
    status?: 'public' | 'private'; // Status is optional for broader use
}

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
        <div className="p-6 flex-grow">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white pr-2">{post.title}</h3>
                {post.status && (
                    <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${post.status === 'private' ? 'bg-purple-600/50 text-purple-300' : 'bg-green-600/50 text-green-300'}`}>
                        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                    </span>
                )}
            </div>
            <p className="text-gray-400 mb-4 line-clamp-3 text-sm leading-relaxed">
                {post.content}
            </p>
        </div>
        <div className="bg-gray-800/50 border-t border-gray-700 px-6 py-4">
            <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                    By <span className="font-medium text-cyan-400">{post.author.username}</span>
                    <span className="mx-1">·</span>
                    <span>{formattedDate}</span>
                </div>
                <Link href={`/posts/${post._id}`} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                    Details &rarr;
                </Link>
            </div>
        </div>
    </div>
  );
}