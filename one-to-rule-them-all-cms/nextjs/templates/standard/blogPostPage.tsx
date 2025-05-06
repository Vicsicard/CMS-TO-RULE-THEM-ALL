import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import StandardLayout from './layout';
import ReactMarkdown from 'react-markdown';

interface BlogPostPageProps {
  siteData: any;
  postId: string;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ siteData, postId }) => {
  const { site, blogPosts, media } = siteData;
  const router = useRouter();
  
  // Find the current post
  const post = blogPosts?.find((p: any) => p.id === postId);
  
  if (!post) {
    return (
      <StandardLayout title="Post Not Found" siteData={siteData}>
        <div className="py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Post Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Sorry, the blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/blog" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300">
            Back to Blog
          </Link>
        </div>
      </StandardLayout>
    );
  }
  
  // Find related posts (same category or tag if available, otherwise recent posts)
  const relatedPosts = blogPosts
    ?.filter((p: any) => 
      p.id !== post.id && 
      p.status === 'published' &&
      (
        (post.category && p.category === post.category) ||
        (post.tags && p.tags && post.tags.some((tag: string) => p.tags.includes(tag)))
      )
    )
    .slice(0, 3) || [];
    
  // If not enough related posts by category/tag, add recent posts
  if (relatedPosts.length < 3) {
    const recentPosts = blogPosts
      ?.filter((p: any) => 
        p.id !== post.id && 
        p.status === 'published' &&
        !relatedPosts.some((rp: any) => rp.id === p.id)
      )
      .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3 - relatedPosts.length) || [];
      
    relatedPosts.push(...recentPosts);
  }
  
  // Function to estimate reading time
  const getReadingTime = (content: string) => {
    if (!content) return '1 min read';
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200); // Assuming 200 words per minute reading speed
    return `${minutes} min read`;
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

  // Custom renderer components for markdown
  const MarkdownComponents = {
    img: (props: any) => {
      const { src, alt } = props;
      // Find media item if it exists
      const mediaItem = media?.find((m: any) => m.url === src || m.filename === src);
      
      return (
        <div className="my-8">
          <div className="relative h-96 w-full rounded-lg overflow-hidden">
            <Image 
              src={mediaItem?.url || src} 
              alt={alt || "Blog post image"} 
              layout="fill" 
              objectFit="contain"
            />
          </div>
          {alt && <p className="text-center text-sm text-gray-500 mt-2">{alt}</p>}
        </div>
      );
    },
    h1: (props: any) => <h1 className="text-3xl font-bold my-6 text-gray-900 dark:text-white" {...props} />,
    h2: (props: any) => <h2 className="text-2xl font-bold my-5 text-gray-900 dark:text-white" {...props} />,
    h3: (props: any) => <h3 className="text-xl font-bold my-4 text-gray-900 dark:text-white" {...props} />,
    p: (props: any) => <p className="my-4 text-gray-700 dark:text-gray-300 leading-relaxed" {...props} />,
    ul: (props: any) => <ul className="list-disc pl-6 my-4 text-gray-700 dark:text-gray-300" {...props} />,
    ol: (props: any) => <ol className="list-decimal pl-6 my-4 text-gray-700 dark:text-gray-300" {...props} />,
    li: (props: any) => <li className="my-1" {...props} />,
    blockquote: (props: any) => (
      <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-6 text-gray-700 dark:text-gray-300" {...props} />
    ),
    a: (props: any) => (
      <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props} target="_blank" rel="noopener noreferrer" />
    ),
    code: (props: any) => {
      const { className, children } = props;
      const match = /language-(\w+)/.exec(className || '');
      return match ? (
        <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto my-6">
          <code className={className}>{children}</code>
        </pre>
      ) : (
        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">{children}</code>
      );
    },
  };

  return (
    <StandardLayout 
      title={post.title} 
      description={post.content?.substring(0, 160)} 
      siteData={siteData}
    >
      <article className="py-12">
        <div className="container mx-auto px-4">
          {/* Article Header */}
          <header className="max-w-3xl mx-auto mb-10">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>{new Date(post.updatedAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
              <span className="mx-2">•</span>
              <span>{getReadingTime(post.content)}</span>
              {post.category && (
                <>
                  <span className="mx-2">•</span>
                  <span className="text-blue-600 dark:text-blue-400">{post.category}</span>
                </>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {post.title}
            </h1>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Featured Image */}
            {getPostImage(post) && (
              <div className="relative h-80 md:h-96 rounded-xl overflow-hidden mb-10">
                <Image 
                  src={getPostImage(post).url} 
                  alt={post.title} 
                  layout="fill" 
                  objectFit="cover"
                  priority
                />
              </div>
            )}
          </header>
          
          {/* Article Content */}
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none dark:prose-dark">
              <ReactMarkdown components={MarkdownComponents}>
                {post.content || ''}
              </ReactMarkdown>
            </div>
            
            {/* Article Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8">
              {/* Author Info (if available) */}
              <div className="flex items-center mb-8">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {site.title ? site.title[0] : 'A'}
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {site.title || 'Author'}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {site.description || 'Website owner'}
                  </p>
                </div>
              </div>
              
              {/* Share Buttons */}
              <div className="flex items-center space-x-4 mb-8">
                <p className="text-gray-600 dark:text-gray-300 font-medium">Share:</p>
                <button 
                  className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                          window.location.href
                        )}&text=${encodeURIComponent(post.title)}`,
                        '_blank'
                      );
                    }
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
                <button 
                  className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.open(
                        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                          window.location.href
                        )}`,
                        '_blank'
                      );
                    }
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.open(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                          window.location.href
                        )}`,
                        '_blank'
                      );
                    }
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </button>
              </div>
              
              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <Link href="/blog" className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Blog
                </Link>
              </div>
            </div>
          </div>
          
          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="max-w-5xl mx-auto mt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Related Posts
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost: any) => (
                  <div key={relatedPost.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transition duration-300 hover:shadow-lg">
                    <div className="relative h-48">
                      {getPostImage(relatedPost) ? (
                        <Image 
                          src={getPostImage(relatedPost).url} 
                          alt={relatedPost.title} 
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
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {relatedPost.content?.substring(0, 100)}...
                      </p>
                      <Link href={`/blog/${relatedPost.id}`} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                        Read More →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </StandardLayout>
  );
};

export default BlogPostPage;
