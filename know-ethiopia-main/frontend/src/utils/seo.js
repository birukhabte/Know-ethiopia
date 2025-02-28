/**
 * SEO Utility Functions
 * Manages document title and meta tags for better search engine optimization
 */

const SITE_NAME = 'Know Ethiopia';
const BRAND_KEYWORD = 'aryanjsx, know Ethiopia';
const DEFAULT_DESCRIPTION = `Explore Ethiopia's incredible destinations, rich heritage, and diverse culture. Discover regions, tourist attractions, churches, waterfalls, and hidden gems across Ethiopia. Built by ${BRAND_KEYWORD}.`;
const DEFAULT_KEYWORDS = 'Ethiopia travel, Ethiopia tourism, Ethiopian regions, tourist places Ethiopia, heritage sites Ethiopia, churches Ethiopia, waterfalls Ethiopia, hill stations, travel guide Ethiopia, aryanjsx';

/**
 * Update document title
 * @param {string} title - Page specific title
 * @param {boolean} includeSiteName - Whether to append site name
 */
export const setPageTitle = (title, includeSiteName = true) => {
  if (includeSiteName && title) {
    document.title = `${title} | ${SITE_NAME}`;
  } else if (title) {
    document.title = title;
  } else {
    document.title = `${SITE_NAME} - Explore Ethiopia's Incredible Destinations`;
  }
};

/**
 * Update or create a meta tag
 * @param {string} name - Meta tag name or property
 * @param {string} content - Meta tag content
 * @param {string} attribute - 'name' or 'property' (for Open Graph)
 */
const setMetaTag = (name, content, attribute = 'name') => {
  if (!content) return;
  
  let meta = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
};

/**
 * Set canonical URL
 * @param {string} url - Canonical URL
 */
const setCanonicalUrl = (url) => {
  let link = document.querySelector('link[rel="canonical"]');
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', url || window.location.href);
};

/**
 * Comprehensive SEO update for a page
 * @param {Object} options - SEO options
 */
export const updateSEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  includeBrand = true
}) => {
  // Build description with optional brand mention
  const fullDescription = description 
    ? (includeBrand && !description.includes(BRAND_KEYWORD) 
        ? `${description} | ${SITE_NAME} by ${BRAND_KEYWORD}` 
        : description)
    : DEFAULT_DESCRIPTION;

  // Set page title
  setPageTitle(title);
  
  // Basic meta tags
  setMetaTag('description', fullDescription);
  setMetaTag('keywords', keywords || DEFAULT_KEYWORDS);
  setMetaTag('author', BRAND_KEYWORD);
  
  // Open Graph tags (for social sharing)
  setMetaTag('og:title', title ? `${title} | ${SITE_NAME}` : SITE_NAME, 'property');
  setMetaTag('og:description', fullDescription, 'property');
  setMetaTag('og:type', type, 'property');
  setMetaTag('og:url', url || window.location.href, 'property');
  setMetaTag('og:site_name', SITE_NAME, 'property');
  
  if (image) {
    setMetaTag('og:image', image, 'property');
    setMetaTag('twitter:image', image);
  }
  
  // Twitter Card tags
  setMetaTag('twitter:card', 'summary_large_image');
  setMetaTag('twitter:title', title ? `${title} | ${SITE_NAME}` : SITE_NAME);
  setMetaTag('twitter:description', fullDescription);
  setMetaTag('twitter:creator', `@${BRAND_KEYWORD}`);
  
  // Canonical URL
  setCanonicalUrl(url);
};

/**
 * SEO configuration for specific page types
 */
export const SEO_CONFIG = {
  home: {
    title: null, // Will use default
    description: `Discover Ethiopia like never before. Explore its regions, tourist destinations, rich heritage, diverse culture, and hidden gems. Your ultimate Ethiopia travel guide by ${BRAND_KEYWORD}.`,
    keywords: 'Ethiopia travel guide, explore Ethiopia, Ethiopian tourism, regions of Ethiopia, tourist places, heritage sites, churches, waterfalls, mountains, aryanjsx, know ethiopia',
  },
  
  state: (stateName, capital) => ({
    title: `${stateName} Tourism - Places to Visit`,
    description: `Explore ${stateName}, Ethiopia. Discover top tourist attractions, heritage sites, culture, cuisine, and best places to visit in ${stateName}. Capital: ${capital || 'N/A'}.`,
    keywords: `${stateName} tourism, ${stateName} travel, places to visit in ${stateName}, ${stateName} attractions, ${stateName} Ethiopia, ${capital || ''} tourism`,
  }),
  
  place: (placeName, stateName, category, description) => ({
    title: `${placeName}, ${stateName}`,
    description: description 
      ? `${description.substring(0, 150)}...` 
      : `Visit ${placeName} in ${stateName}, Ethiopia. A beautiful ${category || 'destination'} with rich history and culture. Plan your trip today.`,
    keywords: `${placeName}, ${stateName} tourism, ${category || 'tourist place'}, visit ${placeName}, ${placeName} Ethiopia, travel ${stateName}`,
  }),
  
  saved: {
    title: 'Saved Places - Your Favorites',
    description: 'View your saved and bookmarked tourist destinations across Ethiopia. Quick access to your favorite places to visit.',
    keywords: 'saved places, bookmarked destinations, favorite tourist places, Ethiopia travel wishlist',
  },
  
  constitution: {
    title: 'Ethiopian Constitution - Learn About Ethiopia',
    description: 'Learn about the Constitution of Ethiopia, its preamble, key features, amendments, and the making of the FDRE Constitution.',
    keywords: 'Ethiopian Constitution, Constitution of Ethiopia, preamble, amendments, fundamental rights, Ethiopian law',
  },
  
  explore: {
    title: 'Explore Ethiopia Map - Regions & Cities',
    description: 'Interactive map of Ethiopia showcasing its regions and major cities. Click on any area to discover tourist attractions, heritage sites, and hidden gems.',
    keywords: 'Ethiopia map, Ethiopian regions, explore Ethiopia, interactive map, travel destinations Ethiopia, aryanjsx',
  },
  
  about: {
    title: 'About Us - Know Ethiopia by aryanjsx',
    description: 'Meet the team behind Know Ethiopia - a platform dedicated to showcasing Ethiopia\'s incredible destinations, heritage, and culture. Built with passion by aryanjsx.',
    keywords: 'about know ethiopia, aryanjsx, ethiopia travel platform, tourism website, team',
  },
  
  contact: {
    title: 'Contact Us - Know Ethiopia',
    description: 'Get in touch with the Know Ethiopia team. We\'d love to hear your feedback, suggestions, and travel stories.',
    keywords: 'contact know ethiopia, feedback, suggestions, ethiopia travel help',
  },
};

/**
 * Generate structured data (JSON-LD) for SEO
 * @param {Object} data - Page data
 * @param {string} type - Type of structured data
 */
export const generateStructuredData = (data, type = 'TouristDestination') => {
  let structuredData = null;
  
  if (type === 'TouristDestination' && data.name) {
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'TouristDestination',
      name: data.name,
      description: data.description,
      address: {
        '@type': 'PostalAddress',
        addressRegion: data.state,
        addressCountry: 'Ethiopia'
      },
      ...(data.image && { image: data.image }),
      ...(data.category && { touristType: data.category }),
    };
  } else if (type === 'WebSite') {
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: window.location.origin,
      description: DEFAULT_DESCRIPTION,
      author: {
        '@type': 'Person',
        name: BRAND_KEYWORD
      }
    };
  }
  
  if (structuredData) {
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }
};

export { SITE_NAME, BRAND_KEYWORD, DEFAULT_DESCRIPTION };

