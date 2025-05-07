import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface DocumentCardProps {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  author?: string;
  imageSrc?: string;
  category?: string;
  readTime?: number; // in minutes
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  title,
  excerpt,
  slug,
  date,
  author,
  imageSrc,
  category,
  readTime
}) => {
  // Format date if provided
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : 'No date';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Image Section with Category Badge */}
      <div className="relative aspect-video overflow-hidden">
        {imageSrc ? (
          <Image 
            src={imageSrc} 
            alt={title}
            fill
            className="object-cover transform hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-selfcast-primary to-selfcast-secondary flex items-center justify-center text-white">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {category && (
          <span className="absolute top-3 right-3 bg-selfcast-accent text-white text-xs font-bold px-2 py-1 rounded-md">
            {category}
          </span>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        <Link href={`/blog/${slug}`}>
          <h3 className="text-xl font-heading font-bold text-selfcast-dark mb-2 hover:text-selfcast-primary transition-colors">
            {title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4">
          {excerpt.length > 120 ? excerpt.substring(0, 120) + '...' : excerpt}
        </p>
        
        {/* Metadata Footer */}
        <div className="flex items-center justify-between pt-4 text-xs text-gray-500 border-t border-gray-100">
          <div className="flex items-center">
            {formattedDate}
            {author && (
              <>
                <span className="mx-2">•</span>
                <span>{author}</span>
              </>
            )}
          </div>
          
          {readTime && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{readTime} min read</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
