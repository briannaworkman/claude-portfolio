import { skillCategories } from '@/data/skills';

export function SkillsSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16 border-t border-border">
      <h2 className="text-2xl font-bold mb-8">Skills</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillCategories.map((category) => (
          <div key={category.name}>
            <h3 className="text-xs font-mono text-violet-400 uppercase tracking-wider mb-3">
              {category.name}
            </h3>
            <ul className="space-y-1">
              {category.skills.map((skill) => (
                <li key={skill} className="text-sm text-text-muted">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
