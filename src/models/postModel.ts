// src/models/postModel.ts
import mongoose, { Schema } from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
  },  
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  status: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
}, { timestamps: true });

const Post = mongoose.models.posts || mongoose.model('posts', postSchema);

export default Post;