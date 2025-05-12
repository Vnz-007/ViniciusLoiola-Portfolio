import { useRef } from "react";
import { Briefcase, Calendar, Download } from "lucide-react";
import { useInView } from "../hooks/useInView";

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.2 });

  const experiences = [
    {
      title: "Senior Frontend Developer",
      company: "Tech Innovations Inc.",
      period: "2020 - Present",
      description:
        "Led frontend development for enterprise-level web applications, improving performance by 40% and implementing modern UI/UX practices.",
    },
    {
      title: "UI/UX Designer",
      company: "Creative Solutions",
      period: "2018 - 2020",
      description:
        "Designed user interfaces for mobile and web applications, collaborating with development teams to ensure implementation fidelity.",
    },
    {
      title: "Web Developer",
      company: "Digital Agency",
      period: "2016 - 2018",
      description:
        "Developed responsive websites and interactive applications for various clients across different industries.",
    },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-20 md:py-32 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div
            className={`space-y-6 transition-all duration-700 ${
              isInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="inline-flex items-center space-x-2 bg-dark-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-dark-600">
              <span className="text-primary-400 font-medium">Sobre Mim</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold">
              Um pouco sobre Vinícius Loiola um mero{" "}
              <span className="text-primary-400">Full-Stack Developer</span>
            </h2>

            <p className="text-gray-300 leading-relaxed">
              Minha stack: HTML | CSS | JavaScript | TypeScript | React |
              Node.js With over 5 years of experience in web development and
              design, I've honed my skills in creating user-centered digital
              experiences that are both aesthetically pleasing and functionally
              effective. I specialize in frontend development with a strong
              emphasis on responsive design, accessibility, and performance
              optimization.
            </p>

            <p className="text-gray-300 leading-relaxed">
              My approach combines technical expertise with creative
              problem-solving, allowing me to build digital solutions that meet
              both user needs and business objectives. I'm constantly learning
              and adapting to new technologies to stay at the forefront of the
              industry.
            </p>

            <div className="pt-4">
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-dark-800 hover:bg-dark-700 border border-dark-600 px-5 py-3 rounded-lg transition-colors"
              >
                <Download size={18} />
                <span>Download Resume</span>
              </a>
            </div>
          </div>

          <div
            className={`space-y-6 transition-all duration-700 delay-300 ${
              isInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6 space-y-6">
              <h3 className="text-xl font-semibold">Experience</h3>

              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-dark-600"
                  >
                    <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-primary-400"></div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-white">{exp.title}</h4>
                      <div className="flex items-center text-sm text-gray-400 space-x-4">
                        <div className="flex items-center space-x-1">
                          <Briefcase size={14} />
                          <span>{exp.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{exp.period}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
