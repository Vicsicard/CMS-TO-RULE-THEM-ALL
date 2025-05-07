import React from 'react';
import Image from 'next/image';
import StandardLayout from '../components/Layout';
import { fetchSiteData } from '../utils/api';

interface AboutPageProps {
  siteData: any;
}

// This function gets called at build time or on server-side renders
export async function getServerSideProps() {
  try {
    // Fetch data from MongoDB via the Payload CMS API
    const siteData = await fetchSiteData();
    
    return {
      props: { siteData },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: { 
        siteData: {
          site: {
            title: 'Self Cast Studios',
            description: 'About Self Cast Studios - Professional podcast and media production'
          },
          bioCards: [],
          quotes: [],
          media: []
        }
      },
    };
  }
}

const AboutPage: React.FC<AboutPageProps> = ({ siteData }) => {
  const { site, bioCards, quotes, media } = siteData;
  
  // Sort bio cards by order if available
  const sortedBioCards = bioCards 
    ? [...bioCards].sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    : [];
  
  // Find the primary profile picture
  const profilePicture = media?.find((item: any) => 
    item.alt?.toLowerCase().includes('profile') || 
    item.alt?.toLowerCase().includes('avatar') ||
    item.filename?.toLowerCase().includes('profile') ||
    item.filename?.toLowerCase().includes('avatar')
  );
  
  // Get bio cards by category
  const aboutMeCards = sortedBioCards.filter((card: any) => 
    card.title?.toLowerCase().includes('about') || 
    card.title?.toLowerCase().includes('bio')
  );
  
  const skillsCards = sortedBioCards.filter((card: any) => 
    card.title?.toLowerCase().includes('skill') || 
    card.title?.toLowerCase().includes('expertise')
  );
  
  const experienceCards = sortedBioCards.filter((card: any) => 
    card.title?.toLowerCase().includes('experience') || 
    card.title?.toLowerCase().includes('work')
  );
  
  const educationCards = sortedBioCards.filter((card: any) => 
    card.title?.toLowerCase().includes('education') || 
    card.title?.toLowerCase().includes('academic')
  );
  
  // Get a testimonial quote if available
  const testimonialQuotes = quotes?.filter((quote: any) => 
    quote.content?.includes('testimonial') || 
    quote.type === 'testimonial'
  ) || [];

  return (
    <StandardLayout 
      title="About Me" 
      description={`Learn more about ${site?.title || 'me'} - background, skills, and experience`} 
      siteData={siteData}
    >
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              About Me
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {site?.description || 'Get to know more about me and my background'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
            {/* Profile Column */}
            <div className="md:col-span-1 space-y-8">
              <div className="flex justify-center">
                {profilePicture ? (
                  <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-xl">
                    <Image 
                      src={profilePicture.url} 
                      alt={profilePicture.alt || 'Profile picture'} 
                      layout="fill" 
                      objectFit="cover"
                    />
                  </div>
                ) : (
                  <div className="w-64 h-64 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Contact Information */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                <ul className="space-y-3">
                  {site?.email && (
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>{site.email}</span>
                    </li>
                  )}
                  
                  {site?.phone && (
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{site.phone}</span>
                    </li>
                  )}
                  
                  {site?.location && (
                    <li className="flex items-center text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{site.location}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            
            {/* Content Column */}
            <div className="md:col-span-2 space-y-12">
              {/* About Me Section */}
              {aboutMeCards.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    About Me
                  </h2>
                  
                  {aboutMeCards.map((card: any) => (
                    <div key={card.id} className="prose max-w-none dark:prose-dark">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-0">{card.title}</h3>
                      <div className="text-gray-700 dark:text-gray-300">
                        {card.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Skills Section */}
              {skillsCards.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Skills & Expertise
                  </h2>
                  
                  {skillsCards.map((card: any) => (
                    <div key={card.id} className="space-y-4">
                      {card.title && (
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                      )}
                      <div className="text-gray-700 dark:text-gray-300">
                        {card.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Experience Section */}
              {experienceCards.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Work Experience
                  </h2>
                  
                  <div className="space-y-8">
                    {experienceCards.map((card: any) => (
                      <div key={card.id} className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                        <div className="text-gray-700 dark:text-gray-300">
                          {card.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Education Section */}
              {educationCards.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Education
                  </h2>
                  
                  <div className="space-y-8">
                    {educationCards.map((card: any) => (
                      <div key={card.id} className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{card.title}</h3>
                        <div className="text-gray-700 dark:text-gray-300">
                          {card.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Other Bio Cards */}
              {sortedBioCards
                .filter((card: any) => 
                  !aboutMeCards.includes(card) && 
                  !skillsCards.includes(card) && 
                  !experienceCards.includes(card) && 
                  !educationCards.includes(card)
                )
                .map((card: any) => (
                  <div key={card.id} className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                      {card.title}
                    </h2>
                    <div className="text-gray-700 dark:text-gray-300">
                      {card.content}
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      {testimonialQuotes.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-800 my-12 rounded-xl">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Testimonials</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonialQuotes.map((quote: any) => (
                <div key={quote.id} className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md">
                  <div className="mb-4">
                    <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <blockquote className="text-xl font-medium text-gray-900 dark:text-white mb-4">
                    {quote.content}
                  </blockquote>
                  {quote.author && (
                    <div className="flex items-center">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {quote.author}
                        </p>
                        {quote.authorTitle && (
                          <p className="text-gray-600 dark:text-gray-300 text-sm">
                            {quote.authorTitle}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </StandardLayout>
  );
};

export default AboutPage;
