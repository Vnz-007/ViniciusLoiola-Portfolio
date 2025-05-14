import { useState, useRef, useEffect } from "react";
import { ArrowUpRight, Github, Star, GitFork } from "lucide-react";

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  topics: string[];
  language: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
}

interface VercelProject {
  id: string;
  name: string;
  framework: string;
  url: string;
  created: number;
}

const Projects = () => {
  const [projects, setProjects] = useState<(GitHubRepo | VercelProject)[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Fetch GitHub projects
        const githubResponse = await fetch(
          "https://api.github.com/users/Vnz-007/repos?per_page=100&sort=created&direction=desc"
        );
        if (!githubResponse.ok) throw new Error("Failed to fetch GitHub projects");
        const githubData: GitHubRepo[] = await githubResponse.json();

        // Fetch Vercel projects (you'll need to implement this endpoint)
        const vercelResponse = await fetch("/api/vercel-projects");
        let vercelData: VercelProject[] = [];
        if (vercelResponse.ok) {
          vercelData = await vercelResponse.json();
        }

        // Combine and sort projects by creation date
        const allProjects = [
          ...githubData,
          ...vercelData,
        ].sort((a, b) => {
          const dateA = 'created_at' in a ? new Date(a.created_at).getTime() : a.created;
          const dateB = 'created_at' in b ? new Date(b.created_at).getTime() : b.created;
          return dateB - dateA;
        });

        setProjects(allProjects);
      } catch (err) {
        setError("Failed to load projects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
    
    // Set up polling to check for new projects every 5 minutes
    const interval = setInterval(fetchProjects, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleProjectsClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const projectsLink = target.closest('a[href="#projects"]');

      if (projectsLink) {
        setShowAnimation(false);
        setTimeout(() => setShowAnimation(true), 50);
      }
    };

    document.addEventListener("click", handleProjectsClick);
    return () => document.removeEventListener("click", handleProjectsClick);
  }, []);

  const categories = [
    "All",
    ...new Set(
      projects
        .map((project) => {
          if ('language' in project) {
            return project.language;
          }
          return (project as VercelProject).framework;
        })
        .filter(Boolean)
    ),
  ];

  const filteredProjects = filter === "All"
    ? projects
    : projects.filter((project) => {
        if ('language' in project) {
          return project.language === filter;
        }
        return (project as VercelProject).framework === filter;
      });

  const ProjectCard = ({
    project,
    index,
  }: {
    project: GitHubRepo | VercelProject;
    index: number;
  }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isGithubProject = 'html_url' in project;

    return (
      <div
        ref={cardRef}
        className={`group bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl overflow-hidden transition-all duration-500 hover:border-primary-400 transform ${
          showAnimation
            ? "opacity-0 translate-y-10"
            : "opacity-100 translate-y-0"
        }`}
        style={{
          transitionDelay: showAnimation ? `${index * 100}ms` : "0ms",
          animation: showAnimation
            ? `slideUp 0.5s ease-out forwards ${index * 100}ms`
            : "none",
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold group-hover:text-primary-400 transition-colors">
              {isGithubProject ? (project as GitHubRepo).name : (project as VercelProject).name}
            </h3>
            <div className="flex space-x-3">
              {isGithubProject && (
                <a
                  href={(project as GitHubRepo).html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={`View ${(project as GitHubRepo).name} on GitHub`}
                >
                  <Github size={18} />
                </a>
              )}
              {(isGithubProject ? (project as GitHubRepo).homepage : (project as VercelProject).url) && (
                <a
                  href={isGithubProject ? (project as GitHubRepo).homepage : (project as VercelProject).url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label={`View live demo of ${isGithubProject ? (project as GitHubRepo).name : (project as VercelProject).name}`}
                >
                  <ArrowUpRight size={18} />
                </a>
              )}
            </div>
          </div>

          {isGithubProject && (
            <>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {(project as GitHubRepo).description || "No description available"}
              </p>

              {(project as GitHubRepo).topics && (project as GitHubRepo).topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {(project as GitHubRepo).topics.slice(0, 3).map((topic, i) => (
                    <span
                      key={i}
                      className="text-xs bg-dark-700/80 text-primary-400 px-2 py-1 rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-xs text-primary-400 font-medium px-3 py-1 bg-primary-400/10 rounded-full">
                  {(project as GitHubRepo).language || "Various"}
                </span>

                <div className="flex space-x-4 text-gray-400 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star size={14} />
                    <span>{(project as GitHubRepo).stargazers_count}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitFork size={14} />
                    <span>{(project as GitHubRepo).forks_count}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {!isGithubProject && (
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-primary-400 font-medium px-3 py-1 bg-primary-400/10 rounded-full">
                {(project as VercelProject).framework}
              </span>
              <span className="text-xs text-gray-400">
                Deployed on Vercel
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <section id="projects" ref={sectionRef} className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            showAnimation
              ? "opacity-0 translate-y-10"
              : "opacity-100 translate-y-0"
          }`}
          style={{
            animation: showAnimation
              ? "slideUp 0.5s ease-out forwards"
              : "none",
          }}
        >
          <div className="inline-flex items-center space-x-2 bg-dark-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-dark-600 mb-4">
            <span className="text-primary-400 font-medium">My Projects</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="text-primary-400">Works</span>
          </h2>

          <p className="text-gray-300">
            A collection of my latest projects from GitHub and Vercel,
            automatically updated as I create new ones.
          </p>
        </div>

        {error ? (
          <div className="text-center text-red-400 mb-8">{error}</div>
        ) : loading ? (
          <div className="flex justify-center mb-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
          </div>
        ) : (
          <>
            <div
              className={`flex justify-center mb-10 transition-all duration-700 ${
                showAnimation
                  ? "opacity-0 translate-y-10"
                  : "opacity-100 translate-y-0"
              }`}
              style={{
                animation: showAnimation
                  ? "slideUp 0.5s ease-out forwards 200ms"
                  : "none",
              }}
            >
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      filter === category
                        ? "bg-primary-500 text-white"
                        : "bg-dark-800 text-gray-300 hover:bg-dark-700"
                    }`}
                  >
                    {category || "Various"}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <ProjectCard 
                  key={'id' in project ? project.id : project.name} 
                  project={project} 
                  index={index} 
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Projects;