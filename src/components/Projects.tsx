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
}

const Projects = () => {
  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);

  const projectOrder = [
    "portfolio",
    "my-portifolio-nocode",
    "spotify-clone",
    "spotify-alura",
    "flutter-techtastes",
    "plataforma-de-agendamento",
    "sistema-de-reembolso",
    "rumble-nftwebsite",
    "vl-convert",
    "relogio-digital",
    "epic-animes",
    "devlinks-myprofile",
    "previsao-do-tempo"
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/users/Vnz-007/repos?per_page=100"
        );
        if (!response.ok) throw new Error("Failed to fetch projects");
        const data: GitHubRepo[] = await response.json();
        
        // Sort projects according to the specified order
        const sortedProjects = [...data].sort((a, b) => {
          const indexA = projectOrder.indexOf(a.name);
          const indexB = projectOrder.indexOf(b.name);
          
          // If both projects are in the order list
          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }
          
          // If only one project is in the order list
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          
          // If neither project is in the order list, maintain original order
          return 0;
        });

        setProjects(sortedProjects);
      } catch (err) {
        setError("Failed to load projects");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Listen for navigation clicks
  useEffect(() => {
    const handleNavClick = () => {
      const hash = window.location.hash;
      if (hash === '#projects') {
        setShowAnimation(true);
      }
    };

    window.addEventListener('hashchange', handleNavClick);
    // Check on initial load
    if (window.location.hash === '#projects') {
      setShowAnimation(true);
    }

    return () => window.removeEventListener('hashchange', handleNavClick);
  }, []);

  const categories = [
    "All",
    ...new Set(projects.map((project) => project.language).filter(Boolean)),
  ];

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((project) => project.language === filter);

  const ProjectCard = ({
    project,
    index,
  }: {
    project: GitHubRepo;
    index: number;
  }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    return (
      <div
        ref={cardRef}
        className={`group bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl overflow-hidden transition-all duration-500 hover:border-primary-400 transform ${
          showAnimation ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"
        }`}
        style={{ transitionDelay: showAnimation ? `${index * 100}ms` : '0ms' }}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold group-hover:text-primary-400 transition-colors">
              {project.name}
            </h3>
            <div className="flex space-x-3">
              <a
                href={project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={`View ${project.name} on GitHub`}
              >
                <Github size={18} />
              </a>
              {project.homepage && (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label={`View live demo of ${project.name}`}
                >
                  <ArrowUpRight size={18} />
                </a>
              )}
            </div>
          </div>

          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {project.description || "No description available"}
          </p>

          {project.topics && project.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.topics.slice(0, 3).map((topic, i) => (
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
              {project.language || "Various"}
            </span>

            <div className="flex space-x-4 text-gray-400 text-sm">
              <div className="flex items-center space-x-1">
                <Star size={14} />
                <span>{project.stargazers_count}</span>
              </div>
              <div className="flex items-center space-x-1">
                <GitFork size={14} />
                <span>{project.forks_count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="projects" ref={sectionRef} className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            showAnimation ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"
          }`}
        >
          <div className="inline-flex items-center space-x-2 bg-dark-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-dark-600 mb-4">
            <span className="text-primary-400 font-medium">My Projects</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured <span className="text-primary-400">Works</span>
          </h2>

          <p className="text-gray-300">
            A showcase of my open-source projects and contributions on GitHub.
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
                showAnimation ? "opacity-100 translate-y-0" : "opacity-100 translate-y-0"
              }`}
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
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Projects;