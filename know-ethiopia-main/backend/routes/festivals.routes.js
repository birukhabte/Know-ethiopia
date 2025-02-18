const express = require('express');
const { authRequired } = require('../middleware/auth.middleware');
const {
  getFavoriteFestivals,
  addFavoriteFestival,
  removeFavoriteFestival,
  checkFavoriteFestival,
} = require('../controllers/festivalFavorites.controller');

const router = express.Router();

// Static list of major Ethiopian festivals mapped to Gregorian months
// Fields match what the frontend FestivalsPage expects
const festivals = [
  {
    id: 1,
    name: 'Genna (Ethiopian Christmas)',
    month: 'January',
    main_states: 'Nationwide',
    best_places: 'Lalibela, Addis Ababa, Gondar',
    image_url: 'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&w=1200&q=80',
    description:
      'Genna, Ethiopian Christmas, is celebrated on January 7th according to the Ethiopian Orthodox calendar. It is marked by church services, traditional games, and family gatherings, with particularly vibrant celebrations in Lalibela where thousands of pilgrims attend all-night prayers.',
  },
  {
    id: 2,
    name: 'Timket (Epiphany)',
    month: 'January',
    main_states: 'Amhara, Addis Ababa, Tigray',
    best_places: 'Gondar, Addis Ababa, Lalibela',
    image_url: 'https://images.unsplash.com/photo-1602434089187-bbfd3f2270e4?auto=format&fit=crop&w=1200&q=80',
    description:
      'Timket is the Ethiopian celebration of Epiphany, commemorating the baptism of Jesus in the Jordan River. Colorful processions escort replicas of the Ark of the Covenant (Tabot) to water sources, where prayers and blessings take place.',
  },
  {
    id: 3,
    name: 'Fasika (Ethiopian Easter)',
    month: 'April',
    main_states: 'Nationwide',
    best_places: 'Addis Ababa, Lalibela, Bahir Dar',
    image_url: 'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1200&q=80',
    description:
      'Fasika, Ethiopian Easter, follows a long period of fasting. The holiday is celebrated with late-night church services, candlelight processions, and large family feasts that break the fast.',
  },
  {
    id: 4,
    name: 'Enkutatash (Ethiopian New Year)',
    month: 'September',
    main_states: 'Nationwide',
    best_places: 'Addis Ababa, Entoto, countryside villages',
    image_url: 'https://images.unsplash.com/photo-1472141521881-95dd3c2a2102?auto=format&fit=crop&w=1200&q=80',
    description:
      'Enkutatash marks the Ethiopian New Year in September, coinciding with the end of the rainy season and the blooming of yellow meskel flowers. Families gather, children sing and present flowers, and church services mark the beginning of a new year.',
  },
  {
    id: 5,
    name: 'Meskel (Finding of the True Cross)',
    month: 'September',
    main_states: 'Addis Ababa, Amhara, Tigray',
    best_places: 'Meskel Square in Addis Ababa, Gondar, Aksum',
    image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
    description:
      'Meskel celebrates the discovery of the True Cross by Empress Helena. In Ethiopia, it is marked by large bonfires (Demera), colorful processions, and mass gatherings, especially at Meskel Square in Addis Ababa.',
  },
  {
    id: 6,
    name: 'Buhe',
    month: 'August',
    main_states: 'Amhara, Oromia, Addis Ababa',
    best_places: 'Addis Ababa, rural highland villages',
    image_url: 'https://images.unsplash.com/photo-1579038773867-044c48829170?auto=format&fit=crop&w=1200&q=80',
    description:
      'Buhe is a children’s festival celebrated in August. Groups of boys sing traditional songs outside homes in the evening and receive freshly baked bread (mulmul) in return.',
  },
  {
    id: 7,
    name: 'Ashenda',
    month: 'August',
    main_states: 'Tigray, Amhara (Lasta, Wag)',
    best_places: 'Mekelle, Axum, Lalibela',
    image_url: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=1200&q=80',
    description:
      'Ashenda is a girls’ festival celebrated mainly in Tigray and parts of Amhara. Young women dress in colorful traditional clothes, style their hair elaborately, and sing and dance in groups throughout the streets.',
  },
  {
    id: 8,
    name: 'Irreecha (Oromo Thanksgiving)',
    month: 'October',
    main_states: 'Oromia',
    best_places: 'Bishoftu (Debre Zeit), Addis Ababa',
    image_url: 'https://images.unsplash.com/photo-1478479474071-8a3014d422c8?auto=format&fit=crop&w=1200&q=80',
    description:
      'Irreecha is a thanksgiving festival celebrated by the Oromo people to give thanks to Waaqa (God) for blessings and the end of the rainy season. Large gatherings take place near lakes and rivers with prayers, songs, and rituals.',
  },
];

// GET /api/festivals - return all Ethiopian festivals
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: festivals,
  });
});

// GET /api/festivals/:id - return a single festival by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const numId = parseInt(id, 10);

  if (isNaN(numId) || numId < 1 || String(numId) !== String(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid festival ID',
    });
  }

  const festival = festivals.find((f) => f.id === numId);

  if (!festival) {
    return res.status(404).json({
      success: false,
      message: 'Festival not found',
    });
  }

  res.json({
    success: true,
    data: festival,
  });
});

// Authenticated favorites endpoints for festivals
// NOTE: Defined before /:id to avoid route conflicts
// GET /api/festivals/favorites - list user favorites
router.get('/favorites', authRequired, getFavoriteFestivals);

// GET /api/festivals/favorites/check/:festivalId - check if a festival is favorited
router.get('/favorites/check/:festivalId', authRequired, checkFavoriteFestival);

// POST /api/festivals/favorites - add a festival to favorites
router.post('/favorites', authRequired, addFavoriteFestival);

// DELETE /api/festivals/favorites/:festivalId - remove a festival from favorites
router.delete('/favorites/:festivalId', authRequired, removeFavoriteFestival);

module.exports = router;

// chore: know-ethiopia backfill 1774943306
