const { sanitizeText, sanitizeUserInput, sanitizeUrl } = require('../utils/sanitize');
const { supabase } = require('../utils/supabase');

function isValidId(id) {
  if (id === undefined || id === null) return false;
  const numId = parseInt(id, 10);
  return !isNaN(numId) && numId > 0 && String(numId) === String(id);
}

async function getFavoriteFestivals(req, res) {
  try {
    const userId = req.user.id;

    if (!supabase) {
      console.error('Supabase client is not configured.');
      return res.status(500).json({
        error: 'Service unavailable',
        message: 'Favorite festivals service is not configured',
      });
    }

    const { data, error } = await supabase
      .from('favorite_festivals')
      .select('festival_id, festival_name, month, main_states, best_places, image, description, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching favorite festivals:', error.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch favorite festivals',
      });
    }

    const favorites = (data || []).map(row => ({
      id: row.festival_id,
      name: row.festival_name,
      month: row.month,
      main_states: row.main_states,
      best_places: row.best_places,
      image_url: row.image,
      description: row.description,
      addedAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
    }));

    res.json({
      success: true,
      favorites,
      count: favorites.length,
    });
  } catch (err) {
    console.error('Error fetching favorite festivals:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch favorite festivals',
    });
  }
}

async function addFavoriteFestival(req, res) {
  try {
    const userId = req.user.id;
    const { id, name, month, main_states, best_places, image_url, description } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Valid festival ID is required',
      });
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Festival name is required',
      });
    }

    const sanitizedImage = image_url ? sanitizeUrl(image_url) : null;

    if (image_url && !sanitizedImage) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Invalid image URL format',
      });
    }

    const sanitizedData = {
      festivalId: parseInt(id, 10),
      name: sanitizeText(name, 255),
      month: sanitizeText(month || '', 50),
      mainStates: sanitizeText(main_states || '', 255),
      bestPlaces: sanitizeText(best_places || '', 255),
      image: sanitizedImage,
      description: sanitizeUserInput(description || '', 2000),
    };

    if (!supabase) {
      console.error('Supabase client is not configured.');
      return res.status(500).json({
        error: 'Service unavailable',
        message: 'Favorite festivals service is not configured',
      });
    }

    const { data: existing, error: existingError } = await supabase
      .from('favorite_festivals')
      .select('id')
      .eq('user_id', userId)
      .eq('festival_id', sanitizedData.festivalId)
      .limit(1);

    if (existingError) {
      console.error('Supabase error checking favorite festival:', existingError.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to save favorite festival',
      });
    }

    if (existing && existing.length > 0) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Festival is already in favorites',
      });
    }
    
    const { error: insertError } = await supabase.from('favorite_festivals').insert({
      user_id: userId,
      festival_id: sanitizedData.festivalId,
      festival_name: sanitizedData.name,
      month: sanitizedData.month,
      main_states: sanitizedData.mainStates,
      best_places: sanitizedData.bestPlaces,
      image: sanitizedData.image,
      description: sanitizedData.description,
    });

    if (insertError) {
      console.error('Supabase error inserting favorite festival:', insertError.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to save favorite festival',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Festival added to favorites',
    });
  } catch (err) {
    console.error('Error saving favorite festival:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to save favorite festival',
    });
  }
}

async function removeFavoriteFestival(req, res) {
  try {
    const userId = req.user.id;
    const { festivalId } = req.params;

    if (!isValidId(festivalId)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Valid festival ID is required',
      });
    }

    const numericFestivalId = parseInt(festivalId, 10);

    if (!supabase) {
      console.error('Supabase client is not configured.');
      return res.status(500).json({
        error: 'Service unavailable',
        message: 'Favorite festivals service is not configured',
      });
    }

    const { data, error } = await supabase
      .from('favorite_festivals')
      .delete()
      .eq('user_id', userId)
      .eq('festival_id', numericFestivalId)
      .select('id');

    if (error) {
      console.error('Supabase error removing favorite festival:', error.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to remove favorite festival',
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Favorite festival not found',
      });
    }

    res.json({
      success: true,
      message: 'Festival removed from favorites',
    });
  } catch (err) {
    console.error('Error removing favorite festival:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to remove favorite festival',
    });
  }
}

async function checkFavoriteFestival(req, res) {
  try {
    const userId = req.user.id;
    const { festivalId } = req.params;

    if (!isValidId(festivalId)) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Valid festival ID is required',
      });
    }

    const numericFestivalId = parseInt(festivalId, 10);

    if (!supabase) {
      console.error('Supabase client is not configured.');
      return res.status(500).json({
        error: 'Service unavailable',
        message: 'Favorite festivals service is not configured',
      });
    }

    const { data, error } = await supabase
      .from('favorite_festivals')
      .select('id')
      .eq('user_id', userId)
      .eq('festival_id', numericFestivalId)
      .limit(1);

    if (error) {
      console.error('Supabase error checking favorite festival:', error.message);
      return res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to check favorite festival',
      });
    }

    res.json({
      success: true,
      isFavorite: data && data.length > 0,
    });
  } catch (err) {
    console.error('Error checking favorite festival:', err.message);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to check favorite festival',
    });
  }
}

module.exports = {
  getFavoriteFestivals,
  addFavoriteFestival,
  removeFavoriteFestival,
  checkFavoriteFestival,
};
