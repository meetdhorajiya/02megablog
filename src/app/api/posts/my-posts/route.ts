// src/app/api/posts/my-posts/route.ts
import { connect } from '@/db/dbConfig';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import Post from '@/models/postModel';
import { NextRequest, NextResponse } from 'next/server';

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const posts = await Post.find({ author: userId })
      .populate('author', 'username') 
      .sort({ createdAt: -1 });

    return NextResponse.json(posts);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}