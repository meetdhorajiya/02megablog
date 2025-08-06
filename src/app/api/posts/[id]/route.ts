import { connect } from '@/db/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import Post from '@/models/postModel';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await Post.findById(params.id).populate('author', 'username _id');
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    
    if (post.status === 'private') {
      const userId = getDataFromToken(request);
      
      if (!userId || post.author._id.toString() !== userId) {
        return NextResponse.json({ error: 'Access denied. This post is private.' }, { status: 403 });
      }
    }

    return NextResponse.json(post);

  } catch (error: any) {
    
    return NextResponse.json({ error: 'Invalid Post ID or server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.author.toString() !== userId) {
      return NextResponse.json({ error: 'You are not authorized to edit this post' }, { status: 403 });
    }

    const { title, content, status } = await request.json();
    const updatedPost = await Post.findByIdAndUpdate(
        params.id,
        { title, content, status },
        { new: true, runValidators: true } 
    );

    return NextResponse.json({
        message: 'Post updated successfully',
        success: true,
        post: updatedPost
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const post = await Post.findById(params.id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.author.toString() !== userId) {
      return NextResponse.json({ error: 'You are not authorized to delete this post' }, { status: 403 });
    }

    await Post.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Post deleted successfully', success: true });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}