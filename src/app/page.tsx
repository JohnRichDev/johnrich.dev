'use client';

import React from 'react';
import { FaJava, FaPhp, FaCss3Alt, FaNodeJs, FaHtml5 } from 'react-icons/fa';
import { SiCplusplus, SiC, SiLua, SiMysql, SiJavascript } from 'react-icons/si';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

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

  React.useEffect(() => {
    let interval: number | null = null;
    let hideTime: number | null = null;
    let paused = false;
    const startCycle = () => {
      if (interval === null) {
        interval = window.setInterval(() => {
          setCurrent((prev) => (prev + 1) % titles.length);
        }, cycleDuration);
      }
    };
    const stopCycle = () => {
      if (interval !== null) {
        clearInterval(interval);
        interval = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopCycle();
        paused = true;
        hideTime = Date.now();
      } else {
        if (paused) {
          const elapsed = hideTime ? Date.now() - hideTime : 0;
          if (elapsed >= fadeDuration) {
            setCurrent((prev) => (prev + 1) % titles.length);
          }
        }
        paused = false;
        startCycle();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    startCycle();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stopCycle();
    };
  }, [titles.length, cycleDuration]);

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        position: 'relative',
        minHeight: 24,
        ...style,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={current}
          initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
          animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
          exit={{ clipPath: 'inset(0 100% 0 0)', opacity: 1 }}
          transition={{ duration: fadeDuration / 1000, ease: [0.6, -0.05, 0.01, 0.99] }}
          style={{ display: 'inline-block', position: 'relative' }}
        >
          {titles[current]}
        </motion.span>
      </AnimatePresence>
    </span>
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
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
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
