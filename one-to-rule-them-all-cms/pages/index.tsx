import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/Layout';
import { fetchSiteData } from '../utils/api';
import ContentCard from '../components/ui/ContentCard';

interface HomePageProps {
  siteData: any;
  error?: string;
}

// This function gets called at build time or on server-side renders
export async function getServerSideProps() {
  console.log(' Running getServerSideProps for homepage');
  
  try {
    // Fetch data from MongoDB via the Payload CMS API
    console.log('Fetching site data from API...');
    const siteData = await fetchSiteData();
    
    console.log(' Site data successfully fetched:', {
      siteTitle: siteData?.site?.title || 'Not available',
      blogCount: siteData?.blogPosts?.length || 0,
      mediaCount: siteData?.media?.length || 0,
      bioCards: siteData?.bioCards?.length || 0,
    });
    
    return {
      props: { siteData },
    };
  } catch (error) {
    console.error(' Error in getServerSideProps:', error);
    
    // Return error information to the client
    return {
      props: { 
        siteData: {
          site: {
            title: 'Self Cast Studios',
            description: 'Professional podcast and media production services',
          },
          blogPosts: [],
          bioCards: [],
          quotes: [],
          socialPosts: [],
          media: [],
          projects: []
        },
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }
    };
  }
}

const HomePage: React.FC<HomePageProps> = ({ siteData, error }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  
  // Log when component mounts on client side
  useEffect(() => {
    console.log(' HomePage component mounted');
    
    try {
      console.log(' Available site data:', {
        siteTitle: siteData?.site?.title || 'Not available',
        hasBlogPosts: Array.isArray(siteData?.blogPosts),
        blogPostCount: siteData?.blogPosts?.length || 0,
        hasMedia: Array.isArray(siteData?.media),
        mediaCount: siteData?.media?.length || 0,
      });
      
      if (error) {
        console.error(' Server-side error passed to client:', error);
      }
      
      // Check for critical data
      if (!siteData || !siteData.site) {
        throw new Error('Critical data missing: siteData or siteData.site is undefined');
      }
      
      setIsLoaded(true);
    } catch (err) {
      console.error(' Error during client-side initialization:', err);
      setClientError(err instanceof Error ? err.message : 'An unknown error occurred during initialization');
    }
  }, [siteData, error]);

  // Handle error state
  if (clientError || error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
          <div className="flex items-center text-red-600 mb-6">
            <svg className="h-12 w-12 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h1 className="text-2xl font-bold">Something went wrong</h1>
          </div>
          
          <p className="mb-6 text-gray-700">
            We encountered an issue while loading the Self Cast Studios homepage.
          </p>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 font-medium">Error details:</p>
            <p className="text-gray-700">{clientError || error}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition-colors"
            >
              Reload Page
            </button>
            <Link href="/contact" className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded-md font-medium transition-colors text-center">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Indicate when the page is still loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-selfcast-primary mx-auto"></div>
          <p className="mt-4 text-xl font-medium text-gray-700">Loading Self Cast Studios...</p>
        </div>
      </div>
    );
  }

  const { site, blogPosts = [], bioCards = [], quotes = [], socialPosts = [], media = [], projects = [] } = siteData;
  
  // Find profile picture from media collection
  const profilePicture = media.find((item: any) => 
    item.alt?.toLowerCase().includes('profile') || 
    item.alt?.toLowerCase().includes('avatar') ||
    item.filename?.toLowerCase().includes('profile') ||
    item.filename?.toLowerCase().includes('avatar')
  );
  
  // Get bio information from bio cards
  const aboutMeCard = bioCards.find((card: any) => 
    card.title?.toLowerCase().includes('about') || 
    card.title?.toLowerCase().includes('bio')
  );
  
  // Featured blog posts (latest 3)
  const featuredPosts = Array.isArray(blogPosts) 
    ? [...blogPosts]
        .filter((post: any) => post.status === 'published')
        .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3) 
    : [];
  
  // Featured quote
  const featuredQuote = quotes && quotes.length > 0 
    ? quotes[Math.floor(Math.random() * quotes.length)] 
    : null;
  
  // Featured projects (latest 3)
  const featuredProjects = Array.isArray(projects) 
    ? [...projects]
        .filter((project: any) => project.status === 'published')
        .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3) 
    : [];
  
  console.log(' Rendering homepage with complete data');

  return (
    <Layout title="Home" description={site?.description || "Welcome to Self Cast Studios"} siteData={siteData}>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-selfcast-primary to-selfcast-accent py-12 md:py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container relative z-10 mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold">
                {site?.headline || site?.title || 'Welcome to Self Cast Studios'}
              </h1>
              
              <p className="text-xl opacity-90">
                {site?.tagline || aboutMeCard?.content || site?.description || 'Professional podcast and media production services.'}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/about" className="px-6 py-3 bg-white text-selfcast-primary font-medium rounded-md hover:bg-opacity-90 transition duration-300 shadow-md">
                  Learn More
                </Link>
                <Link href="/contact" className="px-6 py-3 bg-transparent border-2 border-white text-white font-medium rounded-md hover:bg-white/10 transition duration-300">
                  Get in Touch
                </Link>
              </div>
            </div>
            
            <div className="flex justify-center">
              {profilePicture?.url ? (
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <Image 
                    src={profilePicture.url} 
                    alt={profilePicture.alt || 'Self Cast Studios'} 
                    width={320}
                    height={320}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-white/20 flex items-center justify-center border-4 border-white shadow-xl">
                  <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section - Using quotes from MongoDB */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-selfcast-dark">About</h2>
            <p className="text-gray-600 mt-2">Personal insights and reflections</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quotes && quotes.length > 0 ? (
              // Map the first three quotes to cards
              quotes.slice(0, 3).map((quote: any, index: number) => (
                <div key={quote.id || `quote-${index}`} className="bg-gray-50 rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
                  <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-selfcast-primary rounded-full text-white">
                    {index === 0 && (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    {index === 1 && (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    )}
                    {index === 2 && (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-gray-600 mb-4 italic">"{quote.content}"</p>
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-xl font-bold">{quote.author || 'Anonymous'}</h3>
                  </div>
                </div>
              ))
            ) : (
              // Fallback cards if no quotes are available
              <>
                {/* Bio Card Fallback */}
                <div className="bg-gray-50 rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-selfcast-primary rounded-full text-white">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">My Background</h3>
                  <p className="text-gray-600">
                    Personal background and journey information will appear here from the quotes collection.
                  </p>
                </div>
                
                {/* Skills Card Fallback */}
                <div className="bg-gray-50 rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-selfcast-secondary rounded-full text-white">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">My Philosophy</h3>
                  <p className="text-gray-600">
                    Personal philosophies and approach statements will be displayed here from the quotes collection.
                  </p>
                </div>
                
                {/* Experience Card Fallback */}
                <div className="bg-gray-50 rounded-lg p-8 text-center shadow-md hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-selfcast-accent rounded-full text-white">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-3">My Approach</h3>
                  <p className="text-gray-600">
                    Personal approach statements and methodologies will be shown here from the quotes collection.
                  </p>
                </div>
              </>
            )}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/about" className="px-6 py-3 bg-selfcast-primary text-white font-medium rounded-md hover:bg-selfcast-primary/90 transition duration-300 shadow-md">
              Learn More About Me
            </Link>
          </div>
        </div>
      </section>
      
      {/* First Banner Image Section - Between About and Latest Posts */}
      <section className="relative h-80 overflow-hidden">
        {media.find((item: any) => 
          item.alt?.toLowerCase().includes('banner') || 
          item.alt?.toLowerCase().includes('section break 1') ||
          item.filename?.toLowerCase().includes('banner')
        )?.url ? (
          <div className="absolute inset-0">
            <Image 
              src={media.find((item: any) => 
                item.alt?.toLowerCase().includes('banner') || 
                item.alt?.toLowerCase().includes('section break 1') ||
                item.filename?.toLowerCase().includes('banner')
              )?.url || '/images/placeholder-banner.jpg'} 
              alt="Section banner image"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-selfcast-primary to-selfcast-accent">
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")', 
              backgroundSize: '30px 30px' 
            }}></div>
          </div>
        )}
        
        <div className="container relative z-10 mx-auto px-6 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">My Creative Journey</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              {media.find((item: any) => 
                item.alt?.toLowerCase().includes('banner') || 
                item.alt?.toLowerCase().includes('section break 1')
              )?.caption || 'Exploring ideas and sharing experiences through content that matters.'}
            </p>
          </div>
        </div>
      </section>
      
      {/* Featured Blog Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-heading text-selfcast-dark">Latest Posts</h2>
              <p className="text-gray-600 mt-2">Insights and updates from our studio</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post: any, index: number) => (
                <ContentCard
                  key={post.id || index}
                  title={post.title || 'Untitled Post'}
                  excerpt={post.excerpt || post.content?.substring(0, 100) || 'No description available'}
                  slug={`/blog/${post.slug || post.id}`}
                  date={post.publishedAt || post.createdAt}
                  author={post.author}
                  imageSrc={post.featuredImage?.url || '/images/default-post.jpg'}
                  category={post.category}
                />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/blog" className="px-6 py-3 bg-selfcast-primary text-white font-medium rounded-md hover:bg-selfcast-primary/90 transition duration-300 shadow-md">
                View All Posts
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* Second Banner Image Section - Between Latest Posts and Social Media */}
      <section className="relative h-80 overflow-hidden">
        {media.find((item: any) => 
          item.alt?.toLowerCase().includes('banner 2') || 
          item.alt?.toLowerCase().includes('section break 2') ||
          item.filename?.toLowerCase().includes('banner2')
        )?.url ? (
          <div className="absolute inset-0">
            <Image 
              src={media.find((item: any) => 
                item.alt?.toLowerCase().includes('banner 2') || 
                item.alt?.toLowerCase().includes('section break 2') ||
                item.filename?.toLowerCase().includes('banner2')
              )?.url || '/images/placeholder-banner-2.jpg'} 
              alt="Section banner image"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-selfcast-primary to-selfcast-accent">
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")', 
              backgroundSize: '30px 30px' 
            }}></div>
          </div>
        )}
        
        <div className="container relative z-10 mx-auto px-6 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Let's Connect</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              {media.find((item: any) => 
                item.alt?.toLowerCase().includes('banner 2') || 
                item.alt?.toLowerCase().includes('section break 2')
              )?.caption || 'Join me on social media to continue the conversation and stay updated.'}
            </p>
          </div>
        </div>
      </section>
      
      {/* Social Media Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-heading text-selfcast-dark">Social Media</h2>
            <p className="text-gray-600 mt-2">Connect with me across platforms</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* LinkedIn Card */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-[#0077B5] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0077B5] text-white mr-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.68 1.68 0 0 0-1.68 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </div>
                  <h3 className="font-bold">LinkedIn</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {socialPosts.find((post: any) => post.platform?.toLowerCase() === 'linkedin')?.content?.substring(0, 100) + '...' || 
                   'Latest insights and professional updates from my LinkedIn profile.'}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">
                    {socialPosts.find((post: any) => post.platform?.toLowerCase() === 'linkedin')?.publishedAt ? 
                      new Date(socialPosts.find((post: any) => post.platform?.toLowerCase() === 'linkedin')?.publishedAt).toLocaleDateString() : 
                      'Recent'}
                  </span>
                  <a href={socialPosts.find((post: any) => post.platform?.toLowerCase() === 'linkedin')?.link || 'https://linkedin.com'} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-[#0077B5] text-sm font-medium hover:underline">
                    View Post
                  </a>
                </div>
              </div>
            </div>
            
            {/* Instagram Card */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-[#E1306C] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-[#405DE6] via-[#E1306C] to-[#FFDC80] text-white mr-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                    </svg>
                  </div>
                  <h3 className="font-bold">Instagram</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {socialPosts.find((post: any) => post.platform?.toLowerCase() === 'instagram')?.content?.substring(0, 100) + '...' || 
                   'Visual stories and moments shared on my Instagram feed.'}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">
                    {socialPosts.find((post: any) => post.platform?.toLowerCase() === 'instagram')?.publishedAt ? 
                      new Date(socialPosts.find((post: any) => post.platform?.toLowerCase() === 'instagram')?.publishedAt).toLocaleDateString() : 
                      'Recent'}
                  </span>
                  <a href={socialPosts.find((post: any) => post.platform?.toLowerCase() === 'instagram')?.link || 'https://instagram.com'} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-[#E1306C] text-sm font-medium hover:underline">
                    View Post
                  </a>
                </div>
              </div>
            </div>
            
            {/* Facebook Card */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-[#1877F2] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1877F2] text-white mr-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                    </svg>
                  </div>
                  <h3 className="font-bold">Facebook</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {socialPosts.find((post: any) => post.platform?.toLowerCase() === 'facebook')?.content?.substring(0, 100) + '...' || 
                   'Updates and community engagement on my Facebook page.'}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">
                    {socialPosts.find((post: any) => post.platform?.toLowerCase() === 'facebook')?.publishedAt ? 
                      new Date(socialPosts.find((post: any) => post.platform?.toLowerCase() === 'facebook')?.publishedAt).toLocaleDateString() : 
                      'Recent'}
                  </span>
                  <a href={socialPosts.find((post: any) => post.platform?.toLowerCase() === 'facebook')?.link || 'https://facebook.com'} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-[#1877F2] text-sm font-medium hover:underline">
                    View Post
                  </a>
                </div>
              </div>
            </div>
            
            {/* Twitter Card */}
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border-t-4 border-[#1DA1F2] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1DA1F2] text-white mr-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />
                    </svg>
                  </div>
                  <h3 className="font-bold">Twitter</h3>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {socialPosts.find((post: any) => post.platform?.toLowerCase() === 'twitter')?.content?.substring(0, 100) + '...' || 
                   'Latest thoughts and conversations from my Twitter feed.'}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">
                    {socialPosts.find((post: any) => post.platform?.toLowerCase() === 'twitter')?.publishedAt ? 
                      new Date(socialPosts.find((post: any) => post.platform?.toLowerCase() === 'twitter')?.publishedAt).toLocaleDateString() : 
                      'Recent'}
                  </span>
                  <a href={socialPosts.find((post: any) => post.platform?.toLowerCase() === 'twitter')?.link || 'https://twitter.com'} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-[#1DA1F2] text-sm font-medium hover:underline">
                    View Post
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/social" className="px-6 py-3 bg-selfcast-primary text-white font-medium rounded-md hover:bg-selfcast-primary/90 transition duration-300 shadow-md">
              View All Social Posts
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-selfcast-primary to-selfcast-accent text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to elevate your media presence?</h2>
            <p className="text-xl mb-8 opacity-90">Contact our team today for professional podcast and media production services.</p>
            <Link href="/contact" className="px-8 py-4 bg-white text-selfcast-primary font-medium rounded-md hover:bg-opacity-90 transition-all shadow-lg inline-block">
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
