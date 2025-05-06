import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import StandardLayout from './layout';

interface HomePageProps {
  siteData: any;
}

const HomePage: React.FC<HomePageProps> = ({ siteData }) => {
  const { site, blogPosts, bioCards, quotes, socialPosts, media } = siteData;
  
  // Find profile picture from media collection
  const profilePicture = media?.find((item: any) => 
    item.alt?.toLowerCase().includes('profile') || 
    item.alt?.toLowerCase().includes('avatar') ||
    item.filename?.toLowerCase().includes('profile') ||
    item.filename?.toLowerCase().includes('avatar')
  );
  
  // Get bio information from bio cards
  const aboutMeCard = bioCards?.find((card: any) => 
    card.title?.toLowerCase().includes('about') || 
    card.title?.toLowerCase().includes('bio')
  );
  
  // Featured blog posts (latest 3)
  const featuredPosts = blogPosts 
    ? [...blogPosts]
        .filter((post: any) => post.status === 'published')
        .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3) 
    : [];
  
  // Featured quote
  const featuredQuote = quotes && quotes.length > 0 
    ? quotes[Math.floor(Math.random() * quotes.length)] 
    : null;
  
  // Recent social posts (latest 3)
  const recentSocialPosts = socialPosts 
    ? [...socialPosts]
        .filter((post: any) => post.status === 'published')
        .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3) 
    : [];

  return (
    <StandardLayout 
      title="Home" 
      description={site?.description || 'Welcome to my personal website'} 
      siteData={siteData}
    >
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              {site?.title || 'Welcome to My Site'}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {aboutMeCard?.content || site?.description || 'Personal website showcasing my work and thoughts.'}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/about" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300">
                About Me
              </Link>
              <Link href="/projects" className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition duration-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600">
                View My Work
              </Link>
            </div>
          </div>
          
          <div className="flex justify-center">
            {profilePicture ? (
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <Image 
                  src={profilePicture.url} 
                  alt={profilePicture.alt || 'Profile picture'} 
                  layout="fill" 
                  objectFit="cover"
                />
              </div>
            ) : (
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Featured Blog Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12 bg-gray-50 dark:bg-gray-800 rounded-xl my-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Featured Posts</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Latest thoughts and insights</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post: any) => (
                <div key={post.id} className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md transition duration-300 hover:shadow-lg">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {post.content?.substring(0, 120)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </span>
                      <Link href={`/blog/${post.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        Read More →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link href="/blog" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300">
                View All Posts
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* Quote Section */}
      {featuredQuote && (
        <section className="py-16 my-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="mb-4">
                <svg className="h-12 w-12 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 dark:text-white">
                {featuredQuote.content}
              </blockquote>
              {featuredQuote.author && (
                <div className="mt-6">
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                    — {featuredQuote.author}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
      
      {/* Recent Social Posts */}
      {recentSocialPosts.length > 0 && (
        <section className="py-12 bg-gray-50 dark:bg-gray-800 rounded-xl my-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Recent Updates</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Latest social media activity</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentSocialPosts.map((post: any) => (
                <div key={post.id} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 mr-3">
                      {post.platform === 'twitter' && (
                        <svg fill="currentColor" viewBox="0 0 24 24" className="text-blue-400">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      )}
                      {post.platform === 'linkedin' && (
                        <svg fill="currentColor" viewBox="0 0 24 24" className="text-blue-700">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      )}
                      {post.platform === 'instagram' && (
                        <svg fill="currentColor" viewBox="0 0 24 24" className="text-pink-600">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)} • {new Date(post.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {post.content}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link href="/social" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300">
                View All Updates
              </Link>
            </div>
          </div>
        </section>
      )}
      
      {/* Call to Action */}
      <section className="py-16 my-12 bg-blue-600 text-white rounded-xl">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
          </p>
          <Link href="/contact" className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition duration-300">
            Get In Touch
          </Link>
        </div>
      </section>
    </StandardLayout>
  );
};

export default HomePage;
