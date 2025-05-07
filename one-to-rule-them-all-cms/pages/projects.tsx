import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/Layout';
import { fetchSiteData } from '../utils/api';

export async function getServerSideProps() {
  try {
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
            description: 'Self Cast Studios Projects'
          },
          projects: []
        }
      },
    };
  }
}

const ProjectsPage = ({ siteData }: { siteData: any }) => {
  const { site, projects = [] } = siteData;
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Extract unique categories from projects
  const categories = ['all'];
  if (projects.length > 0) {
    projects.forEach((project: any) => {
      if (project.category && !categories.includes(project.category)) {
        categories.push(project.category);
      }
    });
  }
  
  // Filter projects based on active filter
  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter((project: any) => project.category === activeFilter);

  return (
    <Layout 
      title="Projects" 
      description={site?.projectsDescription || 'View our featured projects and client work'}
      siteData={siteData}
    >
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-selfcast-primary/10 to-selfcast-secondary/10 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-selfcast-dark mb-4">
              Our Projects
            </h1>
            <p className="text-xl text-gray-600">
              {site?.projectsDescription || 'Explore our featured projects and client work. We take pride in delivering high-quality media productions.'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Projects Grid Section */}
      <div className="container mx-auto px-6 py-16">
        {/* Filter Navigation */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`mx-2 mb-2 px-4 py-2 rounded-md transition-colors ${
                  activeFilter === category
                    ? 'bg-selfcast-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Projects' : category}
              </button>
            ))}
          </div>
        )}
        
        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project: any) => (
              <div key={project.id} className="group">
                <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-xl transform group-hover:-translate-y-1">
                  {/* Project Image */}
                  <div className="relative h-56 overflow-hidden">
                    {project.featuredImage?.url ? (
                      <Image
                        src={project.featuredImage.url}
                        alt={project.title}
                        fill
                        className="object-cover transform transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-selfcast-primary to-selfcast-secondary flex items-center justify-center text-white">
                        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    {project.category && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-selfcast-accent/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                          {project.category}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Project Information */}
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-bold text-selfcast-dark mb-2 group-hover:text-selfcast-primary transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    
                    {/* Client & Date */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      {project.client && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>{project.client}</span>
                        </div>
                      )}
                      
                      {project.completedAt && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{new Date(project.completedAt).getFullYear()}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* View Project Button */}
                    {project.url ? (
                      <a 
                        href={project.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-selfcast-primary font-medium hover:text-selfcast-accent transition-colors"
                      >
                        View Project
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <Link 
                        href={`/projects/${project.slug || project.id}`}
                        className="inline-flex items-center text-selfcast-primary font-medium hover:text-selfcast-accent transition-colors"
                      >
                        View Details
                        <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <h3 className="text-xl font-heading font-medium text-gray-800 mb-2">No Projects Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {activeFilter === 'all' 
                ? 'No projects have been added yet. Please check back soon!' 
                : `No projects found in the "${activeFilter}" category. Try selecting a different category.`}
            </p>
            
            {activeFilter !== 'all' && (
              <button 
                onClick={() => setActiveFilter('all')}
                className="px-4 py-2 bg-selfcast-primary text-white rounded-md hover:bg-selfcast-primary/90 transition-colors"
              >
                Show All Projects
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Call to Action Section */}
      <div className="bg-selfcast-dark text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Ready to Start Your Own Project?
            </h2>
            <p className="text-gray-300 mb-8">
              Partner with us to bring your podcast or media project to life with professional quality and creative excellence.
            </p>
            <Link 
              href="/contact"
              className="inline-block px-8 py-3 bg-selfcast-accent text-white font-medium rounded-md hover:bg-selfcast-accent/90 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectsPage;
