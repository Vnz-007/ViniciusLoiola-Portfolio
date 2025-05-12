import { useRef } from "react";
import { useInView } from "../hooks/useInView";

const Skill = ({
  name,
  level,
  icon,
  delay = 0,
}: {
  name: string;
  level: number;
  icon: string;
  delay?: number;
}) => {
  return (
    <div
      className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-5 transition-all duration-500 hover:border-primary-400 hover:bg-dark-700/50 opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="text-primary-400 text-xl">{icon}</div>
          <h4 className="font-medium">{name}</h4>
        </div>
        <div className="text-sm text-primary-400 font-medium">{level}%</div>
      </div>

      <div className="w-full h-1.5 bg-dark-600 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full animate-slide-right"
          style={{
            width: `${level}%`,
            animationDelay: `${delay + 300}ms`,
            animationFillMode: "forwards",
          }}
        ></div>
      </div>
    </div>
  );
};

const SkillCategory = ({
  title,
  skills,
  baseDelay = 0,
}: {
  title: string;
  skills: { name: string; level: number; icon: string }[];
  baseDelay?: number;
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill, index) => (
          <Skill
            key={skill.name}
            name={skill.name}
            level={skill.level}
            icon={skill.icon}
            delay={baseDelay + index * 100}
          />
        ))}
      </div>
    </div>
  );
};

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { threshold: 0.1 });

  const frontendSkills = [
    { name: "React.js", level: 95, icon: "⚛️" },
    { name: "TypeScript", level: 90, icon: "TS" },
    { name: "HTML/CSS", level: 98, icon: "🎨" },
    { name: "Next.js", level: 85, icon: "▲" },
  ];

  const designSkills = [
    { name: "UI/UX Design", level: 92, icon: "🎯" },
    { name: "Figma", level: 88, icon: "🖌️" },
    { name: "Responsive Design", level: 95, icon: "📱" },
    { name: "Animation", level: 80, icon: "✨" },
  ];

  const otherSkills = [
    { name: "Node.js", level: 75, icon: "🟢" },
    { name: "GraphQL", level: 70, icon: "◼️" },
    { name: "Git/GitHub", level: 85, icon: "🔄" },
    { name: "SEO", level: 65, icon: "🔍" },
  ];

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-20 md:py-32 relative bg-dark-800/30"
    >
      <div
        className={`container mx-auto px-4 md:px-6 transition-all duration-700 ${
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-dark-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-dark-600 mb-4">
            <span className="text-primary-400 font-medium">My Skills</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Technical Expertise &{" "}
            <span className="text-primary-400">Proficiency</span>
          </h2>

          <p className="text-gray-300">
            I've developed a diverse skill set through years of professional
            experience and continuous learning. Here's a snapshot of my
            technical capabilities.
          </p>
        </div>

        <div className="space-y-10">
          <SkillCategory
            title="Frontend Development"
            skills={frontendSkills}
            baseDelay={isInView ? 200 : 0}
          />
          <SkillCategory
            title="Design"
            skills={designSkills}
            baseDelay={isInView ? 600 : 0}
          />
          <SkillCategory
            title="Other Skills"
            skills={otherSkills}
            baseDelay={isInView ? 1000 : 0}
          />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-dark-600 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-dark-600 to-transparent"></div>
    </section>
  );
};

export default Skills;
