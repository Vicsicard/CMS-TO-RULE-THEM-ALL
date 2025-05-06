import React, { useState } from 'react';
import Image from 'next/image';
import StandardLayout from './layout';

interface ProjectsPageProps {
  siteData: any;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ siteData }) => {
  const { site, bioCards, media } = siteData;
  
  // We'll use the bioCards collection for projects by looking for 
  // cards with project-related titles or categories
  const projectCards = bioCards
    ? bioCards.filter((card: any) => 
        card.title?.toLowerCase().includes('project') || 
        card.category === 'project' ||
        card.type === 'project'
      )
    : [];
    
  // If no specific project cards are found, use other relevant bio cards
  const workCards = bioCards
    ? bioCards.filter((card: any) => 
        card.title?.toLowerCase().includes('work') || 
        card.title?.toLowerCase().includes('portfolio') ||
        card.category === 'work' ||
        card.type === 'work'
      )
    : [];
    
  // Combine and sort by order if available
  const allProjectCards = [...projectCards, ...workCards]
    .filter((card, index, self) => 
      // Remove duplicates (cards that appear in both arrays)
      index === self.findIndex((c) => c.id === card.id)
    )
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  
  // Create project categories for filtering
  const categories = ['All', ...new Set(allProjectCards.map((card: any) => 
    card.category || 'Uncategorized'
  ))];
  
  // State for active category filter
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Filtered projects based on active category
  const filteredProjects = activeCategory === 'All' 
    ? allProjectCards 
    : allProjectCards.filter((card: any) => card.category === activeCategory);
  
  // Try to find images for each project
  const getProjectImage = (project: any) => {
    // Look for a media item with matching name/title to the project
    const matchingMedia = media?.find((m: any) => 
      m.alt?.toLowerCase().includes(project.title?.toLowerCase()) ||
      m.filename?.toLowerCase().includes(project.title?.toLowerCase())
    );
    
    if (matchingMedia) return matchingMedia;
    
    // Otherwise, try to find image references in the content
    const imageRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
    const matches = [...(project.content?.matchAll(imageRegex) || [])];
    
    if (matches.length > 0) {
      const imagePath = matches[0][1];
      const image = media?.find((m: any) => m.url === imagePath || m.filename === imagePath);
      if (image) return image;
    }
    
    // Return a default project image or null
    return null;
  };
  
  // Helper function to extract project details from content
  const extractProjectDetails = (content: string) => {
    if (!content) return { description: '', technologies: [] };
    
    // Extract technologies if they're in a specific format like "Technologies: React, Node.js, MongoDB"
    const techMatch = content.match(/technologies:([^.]*)\.?/i);
    let technologies: string[] = [];
    let description = content;
    
    if (techMatch && techMatch[1]) {
      technologies = techMatch[1].split(',').map(tech => tech.trim());
      // Remove the technologies part from the description
      description = content.replace(techMatch[0], '').trim();
    }
    
    // Limit description length
    if (description.length > 150) {
      description = description.substring(0, 150) + '...';
    }
    
    return { description, technologies };
  };

  return (
    <StandardLayout 
      title="Projects" 
      description="Explore my portfolio of projects and work samples" 
      siteData={siteData}
    >
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Projects
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Explore my work and projects
            </p>
          </div>
          
          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
          
          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project: any) => {
                const projectImage = getProjectImage(project);
                const { description, technologies } = extractProjectDetails(project.content);
                
                return (
                  <div 
                    key={project.id} 
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transition duration-300 hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <div className="relative h-56">
                      {projectImage ? (
                        <Image 
                          src={projectImage.url} 
                          alt={project.title} 
                          layout="fill" 
                          objectFit="cover"
                        />
                      ) : (
                        <div className="bg-gray-200 dark:bg-gray-700 h-full flex items-center justify-center">
                          <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      )}
                      
                      {project.category && (
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                            {project.category}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {project.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {description}
                      </p>
                      
                      {technologies.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {technologies.map((tech: string, index: number) => (
                              <span 
                                key={index} 
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {project.link && (
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 mt-2"
                        >
                          View Project
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 dark:text-gray-300">
                No projects available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 my-12 bg-blue-600 text-white rounded-xl">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Interested in working together?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision.
          </p>
          <a 
            href="/contact" 
            className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-gray-100 transition duration-300"
          >
            Get In Touch
          </a>
        </div>
      </section>
    </StandardLayout>
  );
};

export default ProjectsPage;
