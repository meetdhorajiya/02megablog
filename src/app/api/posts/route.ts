import { connect } from '@/db/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import Post from '@/models/postModel';
import User from '@/models/userModel'; // Import User model for validation
import { NextRequest, NextResponse } from 'next/server';

connect();

/**
 * Handles the creation of a new post.
 * Expects title, content, status, and imageUrl in the request body.
 * Requires user authentication.
 */
export async function POST(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Optional: Verify user exists in the database for extra security
    const user = await User.findById(userId);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { title, content, status, imageUrl } = await request.json();
    
    // Validate that all required fields are present
    if (!title || !content || !imageUrl) {
        return NextResponse.json({ error: 'Title, content, and an image are required' }, { status: 400 });
    }

    const newPost = new Post({
      title,
      content,
      status,      // 'public' or 'private'
      imageUrl,    // The URL from the file upload
      author: userId,
    });

    const savedPost = await newPost.save();
    
    return NextResponse.json({
      message: 'Post created successfully',
      success: true,
      post: savedPost,
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Handles fetching all posts that are marked as 'public'.
 * This is used for the main homepage feed and the /all-posts page.
 * Does not require authentication.
 */
export async function GET(request: NextRequest) {
  try {
    const posts = await Post.find({ status: 'public' })
      .populate('author', 'username') // Only get username from the author object
      .sort({ createdAt: -1 });       // Sort by newest first

    return NextResponse.json(posts);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}