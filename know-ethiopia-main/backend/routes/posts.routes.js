const express = require('express');
const { supabase } = require('../utils/supabase');
const { verifyToken } = require('../utils/jwt');

const router = express.Router();

/**
 * Middleware to verify JWT token
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  
  req.user = decoded;
  next();
}

/**
 * GET /api/posts - Fetch all travel posts
 * Public endpoint
 */
router.get('/', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured on server' });
    }

    const { data: posts, error } = await supabase
      .from('travel_posts_view')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts from Supabase:', error.message);
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }

    const formattedPosts = (posts || []).map(post => ({
      ...post,
      images: post.images ? JSON.parse(post.images) : [],
    }));

    res.json({ posts: formattedPosts });
  } catch (err) {
    console.error('Error fetching posts:', err.message);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

/**
 * GET /api/posts/:id - Fetch single post
 * Public endpoint
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured on server' });
    }

    const { data: post, error } = await supabase
      .from('travel_posts_view')
      .select('*')
      .eq('id', Number(id))
      .single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (error) {
      console.error('Error fetching post from Supabase:', error.message);
      return res.status(500).json({ error: 'Failed to fetch post' });
    }

    const formattedPost = {
      ...post,
      images: post.images ? JSON.parse(post.images) : [],
    };

    res.json({ post: formattedPost });
  } catch (err) {
    console.error('Error fetching post:', err.message);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

/**
 * POST /api/posts - Create a new travel post
 * Protected endpoint - requires authentication
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, rating, images } = req.body;
    const userId = req.user.id;
    
    // Validate required fields
    if (!content || !rating) {
      return res.status(400).json({ error: 'Content and rating are required' });
    }
    
    // Validate rating range
    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured on server' });
    }

    const { data: insertedPosts, error } = await supabase
      .from('travel_posts')
      .insert({
        user_id: userId,
        content,
        rating: ratingNum,
        images: images ? JSON.stringify(images) : null,
      })
      .select('*');

    if (error) {
      console.error('Error inserting post into Supabase:', error.message);
      return res.status(500).json({ error: 'Failed to create post' });
    }

    const postRow = insertedPosts[0];

    const post = {
      ...postRow,
      images: postRow.images ? JSON.parse(postRow.images) : [],
    };

    res.status(201).json({ 
      message: 'Post created successfully',
      post 
    });
  } catch (err) {
    console.error('Error creating post:', err.message);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

/**
 * POST /api/posts/:id/vote - Upvote or downvote a post
 * Protected endpoint - requires authentication
 */
router.post('/:id/vote', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'
    const userId = req.user.id;
    
    if (!voteType || !['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ error: 'Invalid vote type' });
    }
    
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured on server' });
    }

    const numericId = Number(id);

    const { data: post, error: postError } = await supabase
      .from('travel_posts')
      .select('id, upvotes, downvotes')
      .eq('id', numericId)
      .single();

    if (postError && postError.code === 'PGRST116') {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (postError) {
      console.error('Error fetching post for vote:', postError.message);
      return res.status(500).json({ error: 'Failed to vote on post' });
    }
    
    // Check if user already voted
    const { data: existingVotes, error: voteSelectError } = await supabase
      .from('post_votes')
      .select('id, vote_type')
      .eq('post_id', numericId)
      .eq('user_id', userId);

    if (voteSelectError) {
      console.error('Error fetching existing vote:', voteSelectError.message);
      return res.status(500).json({ error: 'Failed to vote on post' });
    }
    
    let message = '';
    let newUpvotes = post.upvotes;
    let newDownvotes = post.downvotes;
    
    if (existingVotes && existingVotes.length > 0) {
      const existingVote = existingVotes[0];
      
      if (existingVote.vote_type === voteType) {
        // Same vote - remove it (toggle off)
        const { error: deleteError } = await supabase
          .from('post_votes')
          .delete()
          .eq('id', existingVote.id);

        if (deleteError) {
          console.error('Error deleting vote:', deleteError.message);
          return res.status(500).json({ error: 'Failed to vote on post' });
        }
        
        if (voteType === 'upvote') {
          newUpvotes = Math.max(0, newUpvotes - 1);
        } else {
          newDownvotes = Math.max(0, newDownvotes - 1);
        }
        
        message = 'Vote removed';
      } else {
        // Different vote - update it
        const { error: updateVoteError } = await supabase
          .from('post_votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id);

        if (updateVoteError) {
          console.error('Error updating vote:', updateVoteError.message);
          return res.status(500).json({ error: 'Failed to vote on post' });
        }
        
        if (voteType === 'upvote') {
          newUpvotes += 1;
          newDownvotes = Math.max(0, newDownvotes - 1);
        } else {
          newDownvotes += 1;
          newUpvotes = Math.max(0, newUpvotes - 1);
        }
        
        message = 'Vote changed';
      }
    } else {
      // New vote
      const { error: insertVoteError } = await supabase
        .from('post_votes')
        .insert({
          post_id: numericId,
          user_id: userId,
          vote_type: voteType,
        });

      if (insertVoteError) {
        console.error('Error inserting vote:', insertVoteError.message);
        return res.status(500).json({ error: 'Failed to vote on post' });
      }
      
      if (voteType === 'upvote') {
        newUpvotes += 1;
      } else {
        newDownvotes += 1;
      }
      
      message = 'Vote recorded';
    }
    
    // Update post vote counts
    const { error: updatePostError } = await supabase
      .from('travel_posts')
      .update({ upvotes: newUpvotes, downvotes: newDownvotes })
      .eq('id', numericId);

    if (updatePostError) {
      console.error('Error updating post vote counts:', updatePostError.message);
      return res.status(500).json({ error: 'Failed to vote on post' });
    }
    
    res.json({ 
      message,
      upvotes: newUpvotes,
      downvotes: newDownvotes 
    });
  } catch (err) {
    console.error('Error voting on post:', err.message);
    res.status(500).json({ error: 'Failed to vote on post' });
  }
});

/**
 * GET /api/posts/:id/vote - Get user's vote on a post
 * Protected endpoint - requires authentication
 */
router.get('/:id/vote', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured on server' });
    }

    const numericId = Number(id);

    const { data: votes, error } = await supabase
      .from('post_votes')
      .select('vote_type')
      .eq('post_id', numericId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching vote from Supabase:', error.message);
      return res.status(500).json({ error: 'Failed to fetch vote' });
    }

    res.json({ 
      userVote: votes && votes.length > 0 ? votes[0].vote_type : null 
    });
  } catch (err) {
    console.error('Error fetching vote:', err.message);
    res.status(500).json({ error: 'Failed to fetch vote' });
  }
});

/**
 * DELETE /api/posts/:id - Delete a post
 * Protected endpoint - only post owner can delete
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    if (!supabase) {
      return res.status(500).json({ error: 'Supabase not configured on server' });
    }

    const numericId = Number(id);

    const { data: post, error: postError } = await supabase
      .from('travel_posts')
      .select('id, user_id')
      .eq('id', numericId)
      .single();

    if (postError && postError.code === 'PGRST116') {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (postError) {
      console.error('Error fetching post for delete:', postError.message);
      return res.status(500).json({ error: 'Failed to delete post' });
    }

    if (post.user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }
    const { error: deleteError } = await supabase
      .from('travel_posts')
      .delete()
      .eq('id', numericId);

    if (deleteError) {
      console.error('Error deleting post from Supabase:', deleteError.message);
      return res.status(500).json({ error: 'Failed to delete post' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err.message);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;


// chore: know-ethiopia backfill 1774943306
