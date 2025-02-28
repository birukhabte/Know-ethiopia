const { sanitizeText, sanitizeUserInput, sanitizeUrl } = require('../utils/sanitize');
const { supabase } = require('../utils/supabase');

/**
 * SECURITY: Input validation helpers
 */

/**
 * Validate that an ID is a positive integer
 * SECURITY: Prevents SQL injection and invalid data
 */
function isValidId(id) {
  if (id === undefined || id === null) return false;
  const numId = parseInt(id, 10);
  return !isNaN(numId) && numId > 0 && String(numId) === String(id);
}

/**
 * Get all saved places for the authenticated user
 * GET /api/saved-places
 */
async function getSavedPlaces(req, res) {
  try {
    const userId = req.user.id;
    
    if (!supabase) {
      console.error('Supabase client is not configured.');
      return res.status(500).json({
        error: 'Service unavailable',
        message: 'Saved places service is not configured',
      });
    }

    const { data, error } = await supabase
      .from('saved_places')
      .select('id, place_id, place_name, state, state_slug, category, image, description, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching saved places:', error.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch saved places',
      });
    }
    
    // Transform to match frontend bookmark format
    const bookmarks = (data || []).map(place => ({
      id: place.place_id,
      name: place.place_name,
      state: place.state,
      stateSlug: place.state_slug,
      category: place.category,
      image: place.image,
      description: place.description,
      addedAt: place.created_at ? new Date(place.created_at).getTime() : Date.now(),
    }));
    
    res.json({
      success: true,
      bookmarks,
      count: bookmarks.length,
    });
  } catch (err) {
    console.error('Error fetching saved places:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch saved places',
    });
  }
}

/**
 * Add a place to saved places
 * POST /api/saved-places
 * SECURITY: Comprehensive input validation to prevent injection and abuse
 */
async function addSavedPlace(req, res) {
  try {
    const userId = req.user.id;
    const { id, name, state, stateSlug, category, image, description } = req.body;
    
    // SECURITY: Validate place ID is a positive integer
    if (!isValidId(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Valid place ID is required',
      });
    }
    
    // SECURITY: Validate name is a non-empty string
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Place name is required',
      });
    }

    // SECURITY: Sanitize all inputs to prevent Stored XSS
    const sanitizedImage = image ? sanitizeUrl(image) : null;
    
    // SECURITY: Validate image URL if provided
    if (image && !sanitizedImage) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid image URL format',
      });
    }
    
    // SECURITY: Sanitize all string inputs - strips HTML to prevent XSS
    const sanitizedData = {
      placeId: parseInt(id, 10),
      name: sanitizeText(name, 255),
      state: sanitizeText(state || '', 100),
      stateSlug: sanitizeText(stateSlug || '', 100),
      category: sanitizeText(category || 'Place', 100),
      image: sanitizedImage,
      // SECURITY: sanitizeUserInput for longer text content
      description: sanitizeUserInput(description || '', 2000),
    };
    
    if (!supabase) {
      console.error('Supabase client is not configured.');
      return res.status(500).json({
        error: 'Service unavailable',
        message: 'Saved places service is not configured',
      });
    }

    const { data: existing, error: existingError } = await supabase
      .from('saved_places')
      .select('id')
      .eq('user_id', userId)
      .eq('place_id', sanitizedData.placeId)
      .limit(1);

    if (existingError) {
      console.error('Supabase error checking existing saved place:', existingError.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to save place',
      });
    }

    if (existing && existing.length > 0) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Place is already saved',
      });
    }
    
    const { error: insertError } = await supabase.from('saved_places').insert({
      user_id: userId,
      place_id: sanitizedData.placeId,
      place_name: sanitizedData.name,
      state: sanitizedData.state,
      state_slug: sanitizedData.stateSlug,
      category: sanitizedData.category,
      image: sanitizedData.image,
      description: sanitizedData.description,
    });

    if (insertError) {
      console.error('Supabase error inserting saved place:', insertError.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to save place',
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Place saved successfully',
    });
  } catch (err) {
    // SECURITY: Don't expose internal error details
    console.error('Error saving place:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to save place',
    });
  }
}

/**
 * Remove a place from saved places
 * DELETE /api/saved-places/:placeId
 * SECURITY: Validates placeId is a positive integer
 */
async function removeSavedPlace(req, res) {
  try {
    const userId = req.user.id;
    const { placeId } = req.params;
    
    // SECURITY: Validate placeId is a positive integer
    if (!isValidId(placeId)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Valid place ID is required',
      });
    }
    
    const numericPlaceId = parseInt(placeId, 10);
    
    if (!supabase) {
      console.error('Supabase client is not configured.');
      return res.status(500).json({
        error: 'Service unavailable',
        message: 'Saved places service is not configured',
      });
    }

    const { data, error } = await supabase
      .from('saved_places')
      .delete()
      .eq('user_id', userId)
      .eq('place_id', numericPlaceId)
      .select('id');

    if (error) {
      console.error('Supabase error removing saved place:', error.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to remove saved place',
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Saved place not found',
      });
    }
    
    res.json({
      success: true,
      message: 'Place removed from saved',
    });
  } catch (err) {
    console.error('Error removing saved place:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to remove saved place',
    });
  }
}

/**
 * Clear all saved places for the user
 * DELETE /api/saved-places
 */
async function clearSavedPlaces(req, res) {
  try {
    const userId = req.user.id;
    
    if (!supabase) {
      console.error('Supabase client is not configured.');
      return res.status(500).json({
        error: 'Service unavailable',
        message: 'Saved places service is not configured',
      });
    }

    const { error } = await supabase
      .from('saved_places')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Supabase error clearing saved places:', error.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to clear saved places',
      });
    }
    
    res.json({
      success: true,
      message: 'All saved places cleared',
    });
  } catch (err) {
    console.error('Error clearing saved places:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to clear saved places',
    });
  }
}

/**
 * Check if a place is saved
 * GET /api/saved-places/check/:placeId
 * SECURITY: Validates placeId is a positive integer
 */
async function checkSavedPlace(req, res) {
  try {
    const userId = req.user.id;
    const { placeId } = req.params;
    
    // SECURITY: Validate placeId is a positive integer
    if (!isValidId(placeId)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Valid place ID is required',
      });
    }
    
    const numericPlaceId = parseInt(placeId, 10);
    
    if (!supabase) {
      console.error('Supabase client is not configured.');
      return res.status(500).json({
        error: 'Service unavailable',
        message: 'Saved places service is not configured',
      });
    }

    const { data, error } = await supabase
      .from('saved_places')
      .select('id')
      .eq('user_id', userId)
      .eq('place_id', numericPlaceId)
      .limit(1);

    if (error) {
      console.error('Supabase error checking saved place:', error.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to check saved status',
      });
    }

    res.json({
      success: true,
      isSaved: data && data.length > 0,
    });
  } catch (err) {
    console.error('Error checking saved place:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to check saved status',
    });
  }
}

module.exports = {
  getSavedPlaces,
  addSavedPlace,
  removeSavedPlace,
  clearSavedPlaces,
  checkSavedPlace,
};
