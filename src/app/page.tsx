'use client';

import React from 'react';
import { FaJava, FaPhp, FaCss3Alt, FaNodeJs, FaHtml5 } from 'react-icons/fa';
import { SiCplusplus, SiC, SiLua, SiMysql, SiJavascript } from 'react-icons/si';
import Image from 'next/image';
import { motion } from 'framer-motion';

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

interface MorphingTitleProps {
  titles: string[];
  fadeDuration?: number;
  cycleDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

function MorphingTitle({
  titles,
  fadeDuration = 300,
  cycleDuration = 2500,
  className = '',
  style = {},
}: MorphingTitleProps) {
  const [current, setCurrent] = React.useState(0);
  const [fade, setFade] = React.useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % titles.length);
        setFade(true);
      }, fadeDuration);
    }, cycleDuration);
    return () => clearInterval(interval);
  }, [titles.length, fadeDuration, cycleDuration]);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: fade ? 1 : 0 }}
      transition={{ duration: fadeDuration / 1000 }}
      className={className}
      style={{ minHeight: 24, ...style }}
    >
      {titles[current]}
    </motion.p>
  );
}

export default function Home() {
  const titles = [
    'Backend Developer',
    'Self-taught Developer',
    'Aspiring Computer Engineer',
  ];

  const bio = `I’m John Rich, a Computer Engineering student from the Philippines with a hobby in building web applications and software. Before college, I worked on personal projects to improve my skills. Through my studies, I’ve learned new languages and deepened my knowledge in programming, focusing on writing clean, efficient code, good design, and performance.`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
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

              <Image
                src="/profile.png"
                alt="John Rich"
                width={70}
                height={70}
                className="cursor-pointer select-none rounded-full object-cover border border-neutral-700"
                priority
                loading="eager"
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
                {technologies.map((tech) => {
                  const Icon = tech.icon;
                  return (
                    <span
                      key={tech.name}
                      className="cursor-pointer select-none flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded"
                    >
                      <Icon className="text-lg text-white" />
                      <span>{tech.name}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </>
  );
}
