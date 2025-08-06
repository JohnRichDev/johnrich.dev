'use client';

import React, { useState } from 'react';
import { FaJava, FaPhp, FaCss3Alt, FaNodeJs, FaHtml5 } from 'react-icons/fa';
import { SiCplusplus, SiC, SiLua, SiMysql, SiJavascript } from 'react-icons/si';
import MorphingTitle from './components/MorphingTitle';
import TechBadge from './components/TechBadge';
import AnimatedContainer from './components/AnimatedContainer';
import Profile from './components/Profile';

const technologies = [
  { name: 'Lua', icon: SiLua },
  { name: 'C Language', icon: SiC },
  { name: 'C++', icon: SiCplusplus },
  { name: 'Java', icon: FaJava },
  { name: 'HTML', icon: FaHtml5 },
  { name: 'CSS', icon: FaCss3Alt },
  { name: 'JavaScript', icon: SiJavascript },
  { name: 'PHP', icon: FaPhp },
  { name: 'Node.js', icon: FaNodeJs },
  { name: 'MySQL', icon: SiMysql },
];

export default function Home() {
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const titles = [
    'Backend Developer',
    'Self-taught Developer',
    'Aspiring Computer Engineer',
  ];

  const bio = `I’m John Rich, a Computer Engineering student from the Philippines with a hobby in building web applications and software. Before college, I worked on personal projects to improve my skills. Through my studies, I’ve learned new languages and deepened my knowledge in programming, focusing on writing clean, efficient code, good design, and performance.`;

  return (
    <>
      <AnimatedContainer isLoading={isProfileLoading}>
        <section className="flex items-center justify-center min-h-screen px-4">
          <div className="bg-neutral-900 border border-neutral-800 p-10 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex items-center justify-between gap-6 mb-6">
              <div>
                <h1 className="text-3xl font-semibold">John Rich</h1>
                <MorphingTitle
                  titles={titles}
                  fadeDuration={400}
                  cycleDuration={2500}
                />
              </div>

              <Profile
                size={70}
                onLoadingStateChange={setIsProfileLoading}
              />
            </div>

            <div className="text-neutral-300 text-justify text-sm leading-relaxed space-y-4 mb-6">
              <h1 className="text-xl font-semibold mb-2">Hi there!</h1>

              <p className="text-base text-white">{bio}</p>
            </div>

            <div>
              <h2 className="text-white text-base font-semibold mb-3">
                Languages & Frameworks
              </h2>
              <div className="flex flex-wrap gap-2 text-sm">
                {technologies.map((tech) => (
                  <TechBadge key={tech.name} name={tech.name} icon={tech.icon} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </AnimatedContainer>
    </>
  );
}
