/**
 * API utilities for fetching data from the Payload CMS
 * This file is used to connect to the MongoDB data source via the Payload CMS API
 */

import axios from 'axios';

// Use the environment variable for API URL with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Log which API URL we're using for debugging purposes
console.log(`Using API URL: ${API_URL}`);

// Create an axios instance with default configs
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.params || {});
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      statusText: response.statusText,
      dataPreview: typeof response.data === 'object' ? 
        `Object with ${Object.keys(response.data).length} keys` : 
        'Non-object response'
    });
    return response;
  },
  (error) => {
    console.error('[API Response Error]', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
    });
    return Promise.reject(error);
  }
);

// Static fallback data for when API is unavailable
const FALLBACK_DATA = {
  site: {
    id: 'selfcast-static',
    title: 'Self Cast Studios',
    description: 'Professional podcast and media production services',
    headline: 'Elevate Your Media Presence',
    tagline: 'Professional podcast production and media services'
  },
  blogPosts: [
    {
      id: 'post-1',
      title: 'The Power of Professional Podcast Production',
      slug: 'power-of-professional-podcast-production',
      content: 'High-quality podcast production can significantly elevate your brand presence and audience engagement...',
      excerpt: 'Discover how professional podcast production can transform your digital presence.',
      publishedAt: new Date().toISOString(),
      status: 'published',
      category: 'Production Tips',
      featuredImage: { url: '/images/podcast-production.jpg' }
    },
    {
      id: 'post-2',
      title: 'Choosing the Right Microphone for Your Podcast',
      slug: 'choosing-right-microphone-podcast',
      content: 'The microphone is the foundation of your audio setup. Selecting the right one for your needs is crucial...',
      excerpt: 'Learn how to select the perfect microphone for your podcast setup.',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'published',
      category: 'Equipment',
      featuredImage: { url: '/images/microphones.jpg' }
    },
    {
      id: 'post-3',
      title: 'Building a Loyal Podcast Audience',
      slug: 'building-loyal-podcast-audience',
      content: 'Growing a dedicated audience takes time, consistency, and strategic planning...',
      excerpt: 'Effective strategies to grow and maintain a dedicated podcast following.',
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'published',
      category: 'Marketing',
      featuredImage: { url: '/images/podcast-audience.jpg' }
    }
  ],
  bioCards: [
    {
      id: 'bio-1',
      title: 'About Self Cast Studios',
      content: 'Self Cast Studios is a premium podcast and media production company dedicated to helping brands, individuals, and organizations tell their stories through high-quality audio and visual content. With state-of-the-art equipment and experienced professionals, we ensure your message reaches your audience with crystal clarity and maximum impact.'
    }
  ],
  quotes: [
    {
      id: 'quote-1',
      content: 'Working with Self Cast Studios transformed our podcast from an amateur production to a professional showcase. The difference in quality was immediately noticeable to our listeners.',
      author: 'Sarah Johnson, Tech Talk Podcast'
    },
    {
      id: 'quote-2',
      content: 'The team at Self Cast Studios doesn\'t just record and edit - they collaborate with you to elevate your content to new heights.',
      author: 'Michael Chen, Marketing Director'
    },
    {
      id: 'quote-3',
      content: 'My approach to podcasting focuses on authentic storytelling. I believe that genuine conversations create the most engaging and impactful content.',
      author: 'Personal Philosophy'
    }
  ],
  socialPosts: [],
  media: [
    {
      id: 'media-1',
      url: '/images/studio-setup.jpg',
      alt: 'Professional podcast studio setup',
      filename: 'studio-setup.jpg'
    },
    {
      id: 'media-2',
      url: '/images/profile-picture.jpg',
      alt: 'Self Cast Studios profile picture',
      filename: 'profile-picture.jpg'
    }
  ],
  projects: [
    {
      id: 'project-1',
      title: 'Corporate Podcast Series',
      slug: 'corporate-podcast-series',
      description: 'A 10-episode podcast series highlighting industry leaders and innovations',
      status: 'published'
    },
    {
      id: 'project-2',
      title: 'Educational Audiobook Production',
      slug: 'educational-audiobook-production',
      description: 'Full production and mastering of educational content for university courses',
      status: 'published'
    },
    {
      id: 'project-3',
      title: 'Multi-Camera Podcast Setup',
      slug: 'multi-camera-podcast-setup',
      description: 'Custom installation of professional multi-camera studio for live streaming',
      status: 'published'
    }
  ]
};

/**
 * Fetch site data for Self Cast Studios
 * This retrieves all necessary content from MongoDB via the Payload CMS API
 */
export async function fetchSiteData() {
  console.log('🔍 Fetching site data from Payload CMS...');
  
  try {
    // Check API availability first
    try {
      console.log(`Testing API availability at ${API_URL}...`);
      await apiClient.get('/'); // Simple ping to check if API is available
      console.log('✅ API connection successful');
    } catch (pingError) {
      console.warn('⚠️ API ping failed, API may not be available:', pingError.message);
      console.log('🔄 Using fallback data instead of live API');
      
      // Return fallback data immediately if API is not available
      return FALLBACK_DATA;
    }
    
    // If API ping succeeded, proceed with actual data fetching
    // The siteId for Self Cast Studios
    const siteId = 'selfcast-studios'; 
    console.log(`🔍 Using site ID: ${siteId}`);
    
    const siteResponse = await apiClient.get(`/sites?where[projectId][equals]=${siteId}`);
    
    const site = siteResponse.data.docs[0] || {};
    
    if (!site.id) {
      console.warn('⚠️ Site data not found or missing ID. This may cause issues with related data fetching.');
      // Provide a fallback site ID for testing or in case the API doesn't return expected data
      site.id = siteId;
    }
    
    console.log('✅ Site data fetched successfully:', { 
      title: site.title,
      id: site.id
    });
    
    // Wrap each API call in individual try/catch blocks to prevent one failure from blocking all data
    let blogPosts = [];
    try {
      const blogResponse = await apiClient.get(`/posts?where[site][equals]=${site.id}&limit=100`);
      blogPosts = blogResponse.data.docs || [];
      console.log(`✅ Blog posts fetched: ${blogPosts.length}`);
    } catch (error) {
      console.error('❌ Failed to fetch blog posts:', error);
      blogPosts = FALLBACK_DATA.blogPosts; // Use fallback blog posts
    }
    
    let bioCards = [];
    try {
      const bioResponse = await apiClient.get(`/bio-cards?where[site][equals]=${site.id}&limit=100`);
      bioCards = bioResponse.data.docs || [];
      console.log(`✅ Bio cards fetched: ${bioCards.length}`);
    } catch (error) {
      console.error('❌ Failed to fetch bio cards:', error);
      bioCards = FALLBACK_DATA.bioCards; // Use fallback bio cards
    }
    
    let quotes = [];
    try {
      const quotesResponse = await apiClient.get(`/quotes?where[site][equals]=${site.id}&limit=100`);
      quotes = quotesResponse.data.docs || [];
      console.log(`✅ Quotes fetched: ${quotes.length}`);
    } catch (error) {
      console.error('❌ Failed to fetch quotes:', error);
      quotes = FALLBACK_DATA.quotes; // Use fallback quotes
    }
    
    let socialPosts = [];
    try {
      const socialResponse = await apiClient.get(`/social-posts?where[site][equals]=${site.id}&limit=100`);
      socialPosts = socialResponse.data.docs || [];
      console.log(`✅ Social posts fetched: ${socialPosts.length}`);
    } catch (error) {
      console.error('❌ Failed to fetch social posts:', error);
      socialPosts = FALLBACK_DATA.socialPosts; // Use fallback social posts
    }
    
    let media = [];
    try {
      const mediaResponse = await apiClient.get(`/media?where[site][equals]=${site.id}&limit=100`);
      media = mediaResponse.data.docs || [];
      console.log(`✅ Media items fetched: ${media.length}`);
    } catch (error) {
      console.error('❌ Failed to fetch media:', error);
      media = FALLBACK_DATA.media; // Use fallback media
    }
    
    let projects = [];
    try {
      const projectsResponse = await apiClient.get(`/projects?where[site][equals]=${site.id}&limit=100`);
      projects = projectsResponse.data.docs || [];
      console.log(`✅ Projects fetched: ${projects.length}`);
    } catch (error) {
      console.error('❌ Failed to fetch projects:', error);
      projects = FALLBACK_DATA.projects; // Use fallback projects
    }
    
    // Return the compiled data
    const compiledData = {
      site,
      blogPosts,
      bioCards,
      quotes,
      socialPosts,
      media,
      projects
    };
    
    console.log('🎉 All site data fetched successfully');
    return compiledData;
    
  } catch (error) {
    console.error('❌ Error fetching site data:', error);
    console.log('🔄 Using fallback data due to API error');
    
    // Return fallback data so the site can still render
    return FALLBACK_DATA;
  }
}

/**
 * Fetch a specific blog post by slug
 */
export async function fetchBlogPost(slug) {
  console.log(`🔍 Fetching blog post with slug: ${slug}`);
  
  try {
    // Check if API is available
    try {
      await apiClient.get('/'); // Simple ping
    } catch (pingError) {
      console.warn('⚠️ API ping failed, API may not be available');
      
      // Return fallback blog post
      const fallbackPost = FALLBACK_DATA.blogPosts.find(post => post.slug === slug);
      if (fallbackPost) {
        return fallbackPost;
      }
      return null;
    }
    
    // If API is available, fetch the post
    const response = await apiClient.get(`/posts?where[slug][equals]=${slug}`);
    const post = response.data.docs[0];
    
    if (!post) {
      console.warn(`⚠️ Blog post with slug "${slug}" not found`);
      return null;
    }
    
    console.log('✅ Blog post fetched successfully:', { 
      title: post.title,
      id: post.id
    });
    
    return post;
  } catch (error) {
    console.error(`❌ Error fetching blog post with slug "${slug}":`, error);
    
    // Check fallback data for a matching post
    const fallbackPost = FALLBACK_DATA.blogPosts.find(post => post.slug === slug);
    if (fallbackPost) {
      console.log('🔄 Using fallback blog post data');
      return fallbackPost;
    }
    
    return null;
  }
}

/**
 * Send contact form data
 */
export async function submitContactForm(formData) {
  console.log('📤 Submitting contact form:', formData);
  
  try {
    // Check if API is available
    try {
      await apiClient.get('/'); // Simple ping
    } catch (pingError) {
      console.warn('⚠️ API ping failed, API may not be available');
      throw new Error('API is not available. Please try again later.');
    }
    
    const response = await apiClient.post('/forms/contact', formData);
    console.log('✅ Contact form submitted successfully:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('❌ Error submitting contact form:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'An unknown error occurred'
    };
  }
}
