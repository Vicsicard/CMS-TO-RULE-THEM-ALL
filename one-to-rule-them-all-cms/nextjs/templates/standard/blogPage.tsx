import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import StandardLayout from './layout';

interface BlogPageProps {
  siteData: any;
}

const BlogPage: React.FC<BlogPageProps> = ({ siteData }) => {
  const { site, blogPosts, media } = siteData;
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  // Featured blog post (most recent)
  const featuredPost = blogPosts && blogPosts.length > 0
    ? [...blogPosts]
        .filter((post: any) => post.status === 'published')
        .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
    : null;
  
  // Filter posts by search term and published status
  const filteredPosts = blogPosts
    ? blogPosts
        .filter((post: any) => post.status === 'published')
        .filter((post: any) => 
          post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          post.content?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    : [];
  
  // Remove featured post from the list if it exists
  const regularPosts = featuredPost 
    ? filteredPosts.filter((post: any) => post.id !== featuredPost.id)
    : filteredPosts;
  
  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = regularPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(regularPosts.length / postsPerPage);
  
  // Function to get an excerpt from content
  const getExcerpt = (content: string, maxLength = 150) => {
    if (!content) return '';
    
    // Remove markdown headings, links, etc.
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // Remove headings
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to just text
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
      .replace(/\*([^*]+)\*/g, '$1') // Remove italic
      .replace(/`([^`]+)`/g, '$1'); // Remove code
      
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...' 
      : plainText;
  };
  
  // Function to extract a blog post image if available
  const getPostImage = (post: any) => {
    // Check if post has a featured image field
    if (post.featuredImage) {
      const image = media?.find((m: any) => m.id === post.featuredImage);
      if (image) return image;
    }
    
    // Look for image references in content
    const imageRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
    const matches = [...(post.content?.matchAll(imageRegex) || [])];
    
    if (matches.length > 0) {
      const imagePath = matches[0][1];
      const image = media?.find((m: any) => m.url === imagePath || m.filename === imagePath);
      if (image) return image;
    }
    
    return null;
  };
  
  // Function to estimate reading time
  const getReadingTime = (content: string) => {
    if (!content) return '1 min read';
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200); // Assuming 200 words per minute reading speed
    return `${minutes} min read`;
  };

  return (
    <StandardLayout 
      title="Blog" 
      description="Read my latest thoughts, ideas, and insights" 
      siteData={siteData}
    >
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Blog
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Thoughts, ideas, and insights
            </p>
          </div>
          
          {/* Search bar */}
          <div className="max-w-xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => { 
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg 
                className="absolute right-3 top-3 h-6 w-6 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
          </div>
          
          {/* Featured Post */}
          {featuredPost && !searchTerm && currentPage === 1 && (
            <div className="mb-16">
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-64 md:h-auto">
                    {getPostImage(featuredPost) ? (
                      <div className="relative h-full">
                        <Image 
                          src={getPostImage(featuredPost).url} 
                          alt={featuredPost.title} 
                          layout="fill" 
                          objectFit="cover"
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-200 dark:bg-gray-700 h-full flex items-center justify-center">
                        <svg className="h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span className="font-medium text-blue-600 dark:text-blue-400">Featured</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(featuredPost.updatedAt).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>{getReadingTime(featuredPost.content)}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {getExcerpt(featuredPost.content, 200)}
                    </p>
                    <Link href={`/blog/${featuredPost.id}`} className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300">
                      Read Article
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Post Grid */}
          {currentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post: any) => (
                <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transition duration-300 hover:shadow-lg">
                  <div className="relative h-48">
                    {getPostImage(post) ? (
                      <Image 
                        src={getPostImage(post).url} 
                        alt={post.title} 
                        layout="fill" 
                        objectFit="cover"
                      />
                    ) : (
                      <div className="bg-gray-200 dark:bg-gray-700 h-full flex items-center justify-center">
                        <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span>{new Date(post.updatedAt).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>{getReadingTime(post.content)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {getExcerpt(post.content)}
                    </p>
                    <Link href={`/blog/${post.id}`} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              {searchTerm ? (
                <p className="text-gray-600 dark:text-gray-300">No posts matching "{searchTerm}". Try a different search term.</p>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No blog posts available yet. Check back soon!</p>
              )}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 ${
                      currentPage === page
                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>
    </StandardLayout>
  );
};

export default BlogPage;
