const { supabase } = require('../utils/supabase');
const { sanitizeText, sanitizeUserInput, sanitizeUrl } = require('../utils/sanitize');

/**
 * SECURITY: Validation helpers
 */

function ensureSupabaseConfigured(res) {
  if (!supabase) {
    res.status(500).json({
      error: 'Supabase not configured',
      message: 'Backend Supabase client is not initialized. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env',
    });
    return false;
  }
  return true;
}

/**
 * Validation helper - checks if value is non-empty string
 */
function isValidString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validation helper - checks if rating is valid (1-5)
 */
function isValidRating(value) {
  const rating = parseInt(value, 10);
  return !isNaN(rating) && rating >= 1 && rating <= 5;
}

/**
 * SECURITY: Validate that an ID is a positive integer
 * Prevents SQL injection and invalid data
 */
function isValidId(id) {
  if (id === undefined || id === null) return false;
  const numId = parseInt(id, 10);
  return !isNaN(numId) && numId > 0;
}

/**
 * Safely parse images JSON field
 * Handles malformed data gracefully
 */
function safeParseImages(imagesData) {
  if (Array.isArray(imagesData)) return imagesData;
  if (!imagesData) return [];
  try {
    const parsed = JSON.parse(imagesData);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    // If JSON parse fails, check if it's a single URL string
    if (typeof imagesData === 'string' && imagesData.startsWith('http')) {
      return [imagesData];
    }
    return [];
  }
}

/**
 * Create a new profile post
 * POST /api/profile/posts
 * SECURITY: Comprehensive input validation
 */
async function createPost(req, res) {
  try {
    if (!ensureSupabaseConfigured(res)) return;

    const { place_name, state, content, rating, images } = req.body;
    const userId = req.user.id;

    // Validate required fields
    const errors = [];

    if (!isValidString(place_name)) {
      errors.push('place_name is required and must be a non-empty string');
    }

    if (!isValidString(state)) {
      errors.push('state is required and must be a non-empty string');
    }

    if (!isValidString(content)) {
      errors.push('content is required and must be a non-empty string');
    }

    if (!isValidRating(rating)) {
      errors.push('rating is required and must be between 1 and 5');
    }

    // SECURITY: Validate images array if provided
    if (images && (!Array.isArray(images) || images.length > 10)) {
      errors.push('images must be an array with max 10 items');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        messages: errors,
      });
    }

    // SECURITY: Sanitize ALL inputs to prevent Stored XSS
    const sanitizedPlaceName = sanitizeText(place_name, 255);
    const sanitizedState = sanitizeText(state, 100);
    // SECURITY: sanitizeUserInput strips all HTML tags to prevent XSS
    const sanitizedContent = sanitizeUserInput(content, 10000);

    // SECURITY: Validate and sanitize image URLs
    let sanitizedImages = null;
    if (images && Array.isArray(images)) {
      sanitizedImages = images
        .map(url => sanitizeUrl(url))
        .filter(url => url !== null);
    }

    const insertPayload = {
      user_id: userId,
      place_name: sanitizedPlaceName,
      state: sanitizedState,
      content: sanitizedContent,
      rating: parseInt(rating, 10),
      images: sanitizedImages || null,
      status: 'pending',
    };

    const { data: createdPost, error: insertError } = await supabase
      .from('profile_posts')
      .insert(insertPayload)
      .select('*')
      .single();

    if (insertError) {
      console.error('Error creating profile post (Supabase insert):', insertError.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to create post',
      });
    }

    let userData = null;
    if (createdPost && createdPost.user_id) {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('name, email, avatar')
        .eq('id', createdPost.user_id)
        .single();

      if (userError) {
        console.error('Error fetching user for profile post (Supabase):', userError.message);
      } else {
        userData = user;
      }
    }

    const post = {
      ...createdPost,
      images: safeParseImages(createdPost.images),
      user_name: userData?.name || 'Anonymous',
      user_email: userData?.email || '',
      user_avatar: userData?.avatar || null,
    };

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post,
    });
  } catch (err) {
    console.error('Error creating profile post:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create post',
    });
  }
}

/**
 * Get all profile posts (only approved ones for public viewing)
 * GET /api/profile/posts
 */
async function getAllPosts(req, res) {
  try {
    if (!ensureSupabaseConfigured(res)) return;

    const { data: posts, error } = await supabase
      .from('profile_posts')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching profile posts (Supabase):', error.message);
      return res.json({
        success: true,
        posts: [],
        count: 0,
        error: error.message,
      });
    }

    const userIds = Array.from(new Set((posts || [])
      .map((p) => p.user_id)
      .filter((id) => id !== null && id !== undefined)));

    let usersById = {};
    if (userIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, name, email, avatar')
        .in('id', userIds);

      if (usersError) {
        console.error('Error fetching users for profile posts (Supabase):', usersError.message);
      } else if (users) {
        usersById = users.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
      }
    }

    const formattedPosts = (posts || []).map((post) => {
      const user = usersById[post.user_id] || {};
      return {
        ...post,
        images: safeParseImages(post.images),
        user_name: user.name || 'Anonymous',
        user_email: user.email || '',
        user_avatar: user.avatar || null,
      };
    });

    console.log(`getAllPosts (Supabase): Found ${formattedPosts.length} approved posts with user data`);

    res.json({
      success: true,
      posts: formattedPosts,
      count: formattedPosts.length,
    });
  } catch (err) {
    console.error('Error fetching profile posts:', err.message, err.code);
    
    // Always return empty array on error - don't block the UI
    return res.json({
      success: true,
      posts: [],
      count: 0,
      error: err.message // Include error for debugging
    });
  }
}

/**
 * Get current user's posts (including pending ones)
 * GET /api/profile/posts/me
 * SECURITY: Returns only the authenticated user's posts
 */
async function getMyPosts(req, res) {
  try {
    if (!ensureSupabaseConfigured(res)) return;

    const userId = req.user.id;
    const { data: posts, error } = await supabase
      .from('profile_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user posts (Supabase):', error.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch your posts',
      });
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email, avatar')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user for my posts (Supabase):', userError.message);
    }

    const formattedPosts = (posts || []).map((post) => ({
      ...post,
      images: safeParseImages(post.images),
      user_name: user?.name || 'Anonymous',
      user_email: user?.email || '',
      user_avatar: user?.avatar || null,
    }));

    res.json({
      success: true,
      posts: formattedPosts,
      count: formattedPosts.length,
    });
  } catch (err) {
    console.error('Error fetching user posts:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch your posts',
    });
  }
}

/**
 * Get a single profile post by ID
 * GET /api/profile/posts/:id
 * SECURITY: Validates ID parameter
 */
async function getPostById(req, res) {
  try {
    if (!ensureSupabaseConfigured(res)) return;

    const { id } = req.params;
    
    // SECURITY: Validate ID is a positive integer
    if (!isValidId(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid post ID',
      });
    }
    
    const numericId = parseInt(id, 10);
    const { data: postData, error } = await supabase
      .from('profile_posts')
      .select('*')
      .eq('id', numericId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile post (Supabase):', error.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch post',
      });
    }

    if (!postData) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Post not found',
      });
    }
    let userData = null;
    if (postData.user_id) {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('name, email, avatar')
        .eq('id', postData.user_id)
        .single();

      if (userError) {
        console.error('Error fetching user for post by id (Supabase):', userError.message);
      } else {
        userData = user;
      }
    }

    const post = {
      ...postData,
      images: safeParseImages(postData.images),
      user_name: userData?.name || 'Anonymous',
      user_email: userData?.email || '',
      user_avatar: userData?.avatar || null,
    };

    res.json({
      success: true,
      post,
    });
  } catch (err) {
    console.error('Error fetching profile post:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch post',
    });
  }
}

/**
 * Vote on a profile post (upvote or downvote)
 * POST /api/profile/posts/:id/vote
 * SECURITY: Validates ID and vote type
 */
async function voteOnPost(req, res) {
  try {
    if (!ensureSupabaseConfigured(res)) return;

    const { id } = req.params;
    const { type } = req.body;
    const userId = req.user.id;

    // SECURITY: Validate ID is a positive integer
    if (!isValidId(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid post ID',
      });
    }

    // Validate vote type
    if (!type || !['upvote', 'downvote'].includes(type)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'type must be either "upvote" or "downvote"',
      });
    }

    const numericId = parseInt(id, 10);
    const { data: post, error: postError } = await supabase
      .from('profile_posts')
      .select('id, upvotes, downvotes')
      .eq('id', numericId)
      .single();

    if (postError && postError.code !== 'PGRST116') {
      console.error('Error fetching profile post for vote (Supabase):', postError.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to vote on post',
      });
    }

    if (!post) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Post not found',
      });
    }
    const { data: existingVote, error: existingError } = await supabase
      .from('profile_post_votes')
      .select('id, vote_type')
      .eq('post_id', numericId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingError) {
      console.error('Error fetching existing vote (Supabase):', existingError.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to vote on post',
      });
    }

    let message = '';
    let newUpvotes = post.upvotes;
    let newDownvotes = post.downvotes;
    let userVote = null;

    if (existingVote) {
      if (existingVote.vote_type === type) {
        const { error: deleteError } = await supabase
          .from('profile_post_votes')
          .delete()
          .eq('post_id', numericId)
          .eq('user_id', userId);

        if (deleteError) {
          console.error('Error deleting vote (Supabase):', deleteError.message);
          return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to vote on post',
          });
        }

        if (type === 'upvote') {
          newUpvotes = Math.max(0, newUpvotes - 1);
        } else {
          newDownvotes = Math.max(0, newDownvotes - 1);
        }

        message = 'Vote removed';
        userVote = null;
      } else {
        const { error: updateError } = await supabase
          .from('profile_post_votes')
          .update({ vote_type: type })
          .eq('id', existingVote.id);

        if (updateError) {
          console.error('Error updating vote (Supabase):', updateError.message);
          return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to vote on post',
          });
        }

        if (type === 'upvote') {
          newUpvotes += 1;
          newDownvotes = Math.max(0, newDownvotes - 1);
        } else {
          newDownvotes += 1;
          newUpvotes = Math.max(0, newUpvotes - 1);
        }

        message = 'Vote changed';
        userVote = type;
      }
    } else {
      const { error: insertError } = await supabase
        .from('profile_post_votes')
        .insert({
          post_id: numericId,
          user_id: userId,
          vote_type: type,
        });

      if (insertError) {
        console.error('Error inserting vote (Supabase):', insertError.message);
        return res.status(500).json({
          error: 'Internal server error',
          message: 'Failed to vote on post',
        });
      }

      if (type === 'upvote') {
        newUpvotes += 1;
      } else {
        newDownvotes += 1;
      }
      message = 'Vote recorded';
      userVote = type;
    }

    const { error: updatePostError } = await supabase
      .from('profile_posts')
      .update({ upvotes: newUpvotes, downvotes: newDownvotes })
      .eq('id', numericId);

    if (updatePostError) {
      console.error('Error updating post vote counts (Supabase):', updatePostError.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to vote on post',
      });
    }

    res.json({
      success: true,
      message,
      upvotes: newUpvotes,
      downvotes: newDownvotes,
      userVote,
    });
  } catch (err) {
    console.error('Error voting on profile post:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to vote on post',
    });
  }
}

/**
 * Get user's vote on a specific post
 * GET /api/profile/posts/:id/vote
 * SECURITY: Validates ID parameter
 */
async function getUserVote(req, res) {
  try {
    if (!ensureSupabaseConfigured(res)) return;

    const { id } = req.params;
    const userId = req.user.id;

    // SECURITY: Validate ID is a positive integer
    if (!isValidId(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid post ID',
      });
    }

    const numericId = parseInt(id, 10);
    const { data: vote, error } = await supabase
      .from('profile_post_votes')
      .select('vote_type')
      .eq('post_id', numericId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user vote (Supabase):', error.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch vote',
      });
    }

    res.json({
      success: true,
      userVote: vote ? vote.vote_type : null,
    });
  } catch (err) {
    console.error('Error fetching user vote:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch vote',
    });
  }
}

/**
 * Update a profile post (only owner can edit)
 * PUT /api/profile/posts/:id
 * SECURITY: Validates ID and ownership
 */
async function updatePost(req, res) {
  try {
    if (!ensureSupabaseConfigured(res)) return;

    const { id } = req.params;
    const { place_name, state, content, rating, images } = req.body;
    const userId = req.user.id;

    // SECURITY: Validate ID is a positive integer
    if (!isValidId(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid post ID',
      });
    }

    // Validate required fields
    const errors = [];

    if (!isValidString(place_name)) {
      errors.push('place_name is required and must be a non-empty string');
    }

    if (!isValidString(state)) {
      errors.push('state is required and must be a non-empty string');
    }

    if (!isValidString(content)) {
      errors.push('content is required and must be a non-empty string');
    }

    if (!isValidRating(rating)) {
      errors.push('rating is required and must be between 1 and 5');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'Validation failed',
        messages: errors,
      });
    }

    const numericId = parseInt(id, 10);
    const { data: existingPost, error: existingError } = await supabase
      .from('profile_posts')
      .select('id, user_id')
      .eq('id', numericId)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      console.error('Error fetching profile post for update (Supabase):', existingError.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update post',
      });
    }

    if (!existingPost) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Post not found',
      });
    }

    // Check ownership (use === with String conversion for type safety)
    if (String(existingPost.user_id) !== String(userId)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not authorized to edit this post',
      });
    }

    // SECURITY: Sanitize ALL inputs to prevent Stored XSS
    const sanitizedPlaceName = sanitizeText(place_name, 255);
    const sanitizedState = sanitizeText(state, 100);
    // SECURITY: sanitizeUserInput strips all HTML tags to prevent XSS
    const sanitizedContent = sanitizeUserInput(content, 10000);

    // SECURITY: Validate and sanitize image URLs
    let sanitizedImages = null;
    if (images && Array.isArray(images)) {
      sanitizedImages = images
        .map(url => sanitizeUrl(url))
        .filter(url => url !== null);
    }

    const updatePayload = {
      place_name: sanitizedPlaceName,
      state: sanitizedState,
      content: sanitizedContent,
      rating: parseInt(rating, 10),
      images: sanitizedImages || null,
    };

    const { data: updatedPost, error: updateError } = await supabase
      .from('profile_posts')
      .update(updatePayload)
      .eq('id', numericId)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating profile post (Supabase):', updateError.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to update post',
      });
    }

    let userData = null;
    if (updatedPost && updatedPost.user_id) {
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('name, email, avatar')
        .eq('id', updatedPost.user_id)
        .single();

      if (userError) {
        console.error('Error fetching user for updated post (Supabase):', userError.message);
      } else {
        userData = user;
      }
    }

    const post = {
      ...updatedPost,
      images: safeParseImages(updatedPost.images),
      user_name: userData?.name || 'Anonymous',
      user_email: userData?.email || '',
      user_avatar: userData?.avatar || null,
    };

    res.json({
      success: true,
      message: 'Post updated successfully',
      post,
    });
  } catch (err) {
    // SECURITY: Don't expose internal error details
    console.error('Error updating profile post:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update post',
    });
  }
}

/**
 * Delete a profile post (only owner can delete)
 * DELETE /api/profile/posts/:id
 * SECURITY: Validates ID and ownership
 */
async function deletePost(req, res) {
  try {
    if (!ensureSupabaseConfigured(res)) return;

    const { id } = req.params;
    const userId = req.user.id;

    // SECURITY: Validate ID is a positive integer
    if (!isValidId(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid post ID',
      });
    }

    const numericId = parseInt(id, 10);
    const { data: existingPost, error: existingError } = await supabase
      .from('profile_posts')
      .select('id, user_id')
      .eq('id', numericId)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      console.error('Error fetching profile post for delete (Supabase):', existingError.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to delete post',
      });
    }

    if (!existingPost) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Post not found',
      });
    }

    // Check ownership (use String() to handle type mismatch)
    if (String(existingPost.user_id) !== String(userId)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not authorized to delete this post',
      });
    }

    const { error: deleteError } = await supabase
      .from('profile_posts')
      .delete()
      .eq('id', numericId);

    if (deleteError) {
      console.error('Error deleting profile post (Supabase):', deleteError.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to delete post',
      });
    }

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting profile post:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete post',
    });
  }
}

/**
 * Get post status counts (for debugging approval workflow)
 * GET /api/profile/posts/status-check
 * PUBLIC: Returns counts of posts by status (no sensitive data)
 * 
 * IMPORTANT: Use this endpoint to verify both admin dashboard and main website
 * are connected to the same database. Compare the 'database' field and counts.
 */
async function getPostStatusCounts(req, res) {
  try {
    if (!ensureSupabaseConfigured(res)) return;

    const { data: posts, error } = await supabase
      .from('profile_posts')
      .select('id, place_name, state, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting post status counts (Supabase):', error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    const totalPosts = (posts || []).length;
    const statusMap = {};
    for (const post of posts || []) {
      const key = post.status || 'null';
      statusMap[key] = (statusMap[key] || 0) + 1;
    }

    const statusCounts = Object.entries(statusMap).map(([status, count]) => ({ status, count }));
    const recentPosts = (posts || []).slice(0, 5);

    const supabaseUrl = process.env.SUPABASE_URL || '';

    res.json({
      success: true,
      source: 'main-website',
      database: supabaseUrl,
      totalPosts,
      statusCounts,
      recentPosts,
      instructions: {
        step1: 'Compare this Supabase URL/project with admin dashboard',
        step2: 'If projects differ, update Vercel environment variables to match',
        step3: 'Both should use same SUPABASE_URL/SUPABASE_PROJECT',
        adminEndpoint: '/api/debug/posts-status (admin dashboard - may still use MySQL)',
        mainEndpoint: '/api/profile/posts/status-check (this endpoint using Supabase)'
      },
      message: 'If approved count is 0 or database names differ, the systems are not synced'
    });
  } catch (err) {
    console.error('Error getting post status counts:', err.message);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostById,
  updatePost,
  voteOnPost,
  getUserVote,
  deletePost,
  getPostStatusCounts,
};

