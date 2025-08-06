// src/app/api/posts/route.ts
import { connect } from '@/db/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import Post from '@/models/postModel';
import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';

connect();

// CREATE a new post
export async function POST(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify user exists in the database
    const user = await User.findById(userId);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { title, content, status } = await request.json();
    if (!title || !content) {
        return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const newPost = new Post({
      title,
      content,
      status, // 'public' or 'private'
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

// GET all PUBLIC posts
export async function GET(request: NextRequest) {
  try {
    const posts = await Post.find({ status: 'public' })
      .populate('author', 'username') // Only get username from author object
      .sort({ createdAt: -1 }); // Sort by newest first

    return NextResponse.json(posts);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}