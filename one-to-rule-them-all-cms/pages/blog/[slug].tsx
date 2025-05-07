import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { fetchSiteData, fetchBlogPost } from '../../utils/api';

export async function getServerSideProps({ params }: { params: { slug: string } }) {
  try {
    // Fetch site data and the specific blog post
    const siteData = await fetchSiteData();
    const post = await fetchBlogPost(params.slug);
    
    // If post not found, return 404
    if (!post) {
      return {
        notFound: true,
      };
    }
    
    return {
      props: { post, siteData },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      notFound: true,
    };
  }
}

const BlogPostPage = ({ post, siteData }: { post: any, siteData: any }) => {
  const router = useRouter();
  
  // Format the date
  const formattedDate = new Date(post?.updatedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Calculate reading time (approx 200 words per minute)
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content?.split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };
  
  // Get related posts (posts with the same category)
  const relatedPosts = siteData?.blogPosts
    ?.filter((p: any) => 
      p.category === post.category && 
      p.id !== post.id && 
      p.status === 'published'
    )
    .slice(0, 3) || [];
  
  return (
    <Layout 
      title={post?.title || 'Blog Post'} 
      description={post?.excerpt || post?.content?.substring(0, 160) || 'Read our latest blog post'}
      siteData={siteData}
    >
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-selfcast-primary/10 to-selfcast-secondary/10 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Navigation Breadcrumb */}
            <div className="flex items-center mb-8 text-sm text-gray-600">
              <Link href="/" className="hover:text-selfcast-primary transition-colors">
                Home
              </Link>
              <svg className="w-3 h-3 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link href="/blog" className="hover:text-selfcast-primary transition-colors">
                Blog
              </Link>
              <svg className="w-3 h-3 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-800 font-medium truncate">
                {post?.title}
              </span>
            </div>
            
            {/* Category Badge */}
            {post?.category && (
              <div className="mb-6">
                <span className="inline-block bg-selfcast-accent text-white text-xs font-bold px-3 py-1 rounded-full">
                  {post.category}
                </span>
              </div>
            )}
            
            {/* Post Title */}
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-selfcast-dark mb-6">
              {post?.title}
            </h1>
            
            {/* Post Metadata */}
            <div className="flex flex-wrap items-center text-gray-600 mb-8">
              <div className="flex items-center mr-6 mb-2">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formattedDate}</span>
              </div>
              
              <div className="flex items-center mr-6 mb-2">
                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{calculateReadingTime(post?.content)} min read</span>
              </div>
              
              {post?.author && (
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{post.author}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          {post?.featuredImage?.url && (
            <div className="mb-12 rounded-xl overflow-hidden shadow-xl">
              <div className="relative aspect-[16/9]">
                <Image 
                  src={post.featuredImage.url} 
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
          
          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <div className="content-body">
              {/* Convert markdown to HTML or use a proper markdown renderer */}
              {post?.content?.split('\n').map((paragraph: string, i: number) => (
                <p key={i} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
          
          {/* Tags & Social Sharing */}
          <div className="mt-16 flex flex-col md:flex-row md:justify-between">
            {/* Tags */}
            {post?.tags && post.tags.length > 0 && (
              <div className="mb-6 md:mb-0">
                <h4 className="text-sm font-bold text-gray-700 mb-2">Tags:</h4>
                <div className="flex flex-wrap">
                  {post.tags.map((tag: string) => (
                    <span 
                      key={tag} 
                      className="mr-2 mb-2 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Social Sharing */}
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-2">Share:</h4>
              <div className="flex space-x-3">
                <button 
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${post?.title}&url=${encodeURIComponent(window.location.href)}`)}
                  className="w-8 h-8 flex items-center justify-center bg-[#1DA1F2] text-white rounded-full hover:opacity-90 transition-opacity"
                  aria-label="Share on Twitter"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" />
                  </svg>
                </button>
                
                <button 
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}
                  className="w-8 h-8 flex items-center justify-center bg-[#1877F2] text-white rounded-full hover:opacity-90 transition-opacity"
                  aria-label="Share on Facebook"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                
                <button 
                  onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${post?.title}`)}
                  className="w-8 h-8 flex items-center justify-center bg-[#0A66C2] text-white rounded-full hover:opacity-90 transition-opacity"
                  aria-label="Share on LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Author Bio */}
          {post?.author && (
            <div className="mt-12 bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-selfcast-dark mb-3">About the Author</h3>
              <div className="flex flex-col md:flex-row items-start gap-4">
                {post.authorImage?.url && (
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image 
                      src={post.authorImage.url} 
                      alt={post.author} 
                      width={64} 
                      height={64} 
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-medium text-selfcast-dark mb-2">{post.author}</h4>
                  {post.authorBio && (
                    <p className="text-gray-600">{post.authorBio}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-heading font-bold text-selfcast-dark mb-8">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost: any) => (
                  <div key={relatedPost.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="relative h-48">
                      {relatedPost.featuredImage?.url ? (
                        <Image 
                          src={relatedPost.featuredImage.url} 
                          alt={relatedPost.title} 
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-selfcast-primary to-selfcast-secondary flex items-center justify-center text-white">
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-bold text-gray-900 mb-2 hover:text-selfcast-primary transition-colors">
                        <Link href={`/blog/${relatedPost.slug}`}>
                          {relatedPost.title}
                        </Link>
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(relatedPost.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <Link 
                        href={`/blog/${relatedPost.slug}`}
                        className="inline-flex items-center text-selfcast-primary font-medium hover:text-selfcast-accent transition-colors text-sm"
                      >
                        Read Article
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Next/Previous Navigation */}
          <div className="mt-16 border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between">
              <button 
                onClick={() => router.back()}
                className="flex items-center text-selfcast-primary hover:text-selfcast-accent transition-colors mb-4 md:mb-0"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Blog
              </button>
              
              <Link 
                href="/contact"
                className="flex items-center text-selfcast-primary hover:text-selfcast-accent transition-colors"
              >
                Have questions?
                <span className="mx-1">Contact us</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPostPage;
