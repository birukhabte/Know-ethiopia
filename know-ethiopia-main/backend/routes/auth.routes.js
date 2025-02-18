const express = require('express');
const passport = require('passport');
const crypto = require('crypto');
const { supabase } = require('../utils/supabase');
const { 
  generateToken, 
  blacklistToken, 
  verifyToken, 
  setTokenCookie, 
  clearTokenCookie,
  getTokenFromRequest 
} = require('../utils/jwt');

const router = express.Router();

/**
 * Ensure Supabase client is available
 * Throws a clear error if Supabase is not configured
 */
function ensureSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env');
  }
}

/**
 * Find user by Google ID or create a new user (Supabase)
 * @param {Object} profile - Google profile data
 * @returns {Object} User from database
 */
async function findOrCreateUser(profile) {
  ensureSupabaseClient();

  // Check if user exists in Supabase
  const { data: existingUser, error: selectError } = await supabase
    .from('users')
    .select('id, google_id, name, email, avatar, role')
    .eq('google_id', profile.id)
    .maybeSingle();

  if (selectError) {
    throw new Error(`Failed to fetch user from Supabase: ${selectError.message}`);
  }

  if (existingUser) {
    // User exists - update avatar and name from Google if changed
    const needsUpdate =
      existingUser.avatar !== profile.photo ||
      existingUser.name !== profile.displayName;

    if (needsUpdate) {
      const { data: updatedUsers, error: updateError } = await supabase
        .from('users')
        .update({
          avatar: profile.photo,
          name: profile.displayName,
        })
        .eq('id', existingUser.id)
        .select('id, google_id, name, email, avatar, role');

      if (updateError) {
        throw new Error(`Failed to update user in Supabase: ${updateError.message}`);
      }

      return Array.isArray(updatedUsers) && updatedUsers.length > 0
        ? updatedUsers[0]
        : existingUser;
    }

    return existingUser;
  }

  // Create new user in Supabase
  const { data: insertedUsers, error: insertError } = await supabase
    .from('users')
    .insert([
      {
        google_id: profile.id,
        name: profile.displayName,
        email: profile.email,
        avatar: profile.photo,
        role: 'user',
      },
    ])
    .select('id, google_id, name, email, avatar, role');

  if (insertError) {
    throw new Error(`Failed to create user in Supabase: ${insertError.message}`);
  }

  if (!insertedUsers || insertedUsers.length === 0) {
    throw new Error('Failed to create user in Supabase: no user returned');
  }

  return insertedUsers[0];
}

// GET /auth/google - Start Google OAuth flow
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

// GET /auth/google/callback - Handle Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/auth/failure',
  }),
  async (req, res) => {
    try {
      // Find or create user in database
      const user = await findOrCreateUser(req.user);

      // Generate JWT token
      const token = generateToken(user);

      // Get frontend URL from environment (production default)
      const clientUrl = process.env.CLIENT_URL || 'https://knowindia.aryankr.in';

      // SECURITY: Set token in HttpOnly cookie (prevents XSS token theft)
      setTokenCookie(res, token);

      // SECURITY: Also pass token in URL for backward compatibility
      // Frontend should prefer cookie but can use URL token for initial setup
      res.redirect(`${clientUrl}/auth/success?token=${token}`);
    } catch (err) {
      console.error('OAuth callback error:', err.message);
      const clientUrl = process.env.CLIENT_URL || 'https://knowindia.aryankr.in';
      res.redirect(`${clientUrl}/auth/failure?error=${encodeURIComponent(err.message)}`);
    }
  }
);

// GET /auth/failure - Handle authentication failure
router.get('/failure', (req, res) => {
  const clientUrl = process.env.CLIENT_URL || 'https://knowindia.aryankr.in';
  res.redirect(`${clientUrl}/auth/failure?error=authentication_failed`);
});

/**
 * GET /auth/logout - Logout user and invalidate token
 * SECURITY: Blacklists the token and clears HttpOnly cookie
 */
router.get('/logout', (req, res) => {
  try {
    // SECURITY: Get token from cookie or header
    const token = getTokenFromRequest(req);
    
    // SECURITY: Blacklist the token to prevent reuse after logout
    if (token && token.trim() !== '') {
      blacklistToken(token);
    }
    
    // SECURITY: Clear the HttpOnly cookie
    clearTokenCookie(res);
    
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    console.error('Logout error:', err.message);
    // SECURITY: Still clear cookie even on error
    clearTokenCookie(res);
    res.json({
      success: true,
      message: 'Logged out',
    });
  }
});

/**
 * POST /auth/logout - Logout user (POST method for better security)
 * SECURITY: POST is preferred for logout to prevent CSRF via GET
 */
router.post('/logout', (req, res) => {
  try {
    // SECURITY: Get token from cookie or header
    const token = getTokenFromRequest(req);
    
    if (token && token.trim() !== '') {
      blacklistToken(token);
    }
    
    // SECURITY: Clear the HttpOnly cookie
    clearTokenCookie(res);
    
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    console.error('Logout error:', err.message);
    clearTokenCookie(res);
    res.json({
      success: true,
      message: 'Logged out',
    });
  }
});

/**
 * GET /auth/status - Check authentication status
 * SECURITY: Returns user info if token is valid, null otherwise
 * Checks HttpOnly cookie first, then Authorization header
 */
router.get('/status', async (req, res) => {
  try {
    // SECURITY: Get token from HttpOnly cookie or header
    const token = getTokenFromRequest(req);
    
    if (!token) {
      return res.json({
        authenticated: false,
        user: null,
      });
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.json({
        authenticated: false,
        user: null,
      });
    }

    ensureSupabaseClient();

    // SECURITY: Verify user still exists in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, avatar')
      .eq('id', decoded.id)
      .maybeSingle();

    if (error || !user) {
      return res.json({
        authenticated: false,
        user: null,
      });
    }
    
    res.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    // SECURITY: Don't expose error details, just return unauthenticated
    res.json({
      authenticated: false,
      user: null,
    });
  }
});

/**
 * GET /auth/me - Get current user info (requires valid token)
 * SECURITY: Validates token and returns user profile
 * Checks HttpOnly cookie first, then Authorization header
 */
router.get('/me', async (req, res) => {
  try {
    // SECURITY: Get token from HttpOnly cookie or header
    const token = getTokenFromRequest(req);
    
    if (!token) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'No token provided',
      });
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid or expired token',
      });
    }

    ensureSupabaseClient();

    // SECURITY: Always verify user exists in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, avatar')
      .eq('id', decoded.id)
      .maybeSingle();

    if (error || !user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'User not found',
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get user info',
    });
  }
});

/**
 * GET /auth/csrf-token - Get CSRF token for state-changing operations
 * SECURITY: Returns a CSRF token that must be included in POST/PUT/DELETE requests
 */
router.get('/csrf-token', (req, res) => {
  // SECURITY: Generate a CSRF token tied to the session
  const csrfToken = crypto.randomBytes(32).toString('hex');
  
  // SECURITY: Store CSRF token in HttpOnly cookie
  res.cookie('csrf_token', csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 60 * 60 * 1000, // 1 hour
    path: '/',
  });
  
  // Return token for frontend to include in requests
  res.json({
    success: true,
    csrfToken,
  });
});

module.exports = router;

// chore: know-ethiopia backfill 1774943306
