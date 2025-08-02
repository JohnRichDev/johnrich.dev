import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MorphingTitleProps {
    titles: string[];
    fadeDuration?: number;
    cycleDuration?: number;
    className?: string;
    style?: React.CSSProperties;
}

const MorphingTitle: React.FC<MorphingTitleProps> = ({
    titles,
    fadeDuration = 300,
    cycleDuration = 2500,
    className = '',
    style = {},
}) => {
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
};

export default MorphingTitle;
