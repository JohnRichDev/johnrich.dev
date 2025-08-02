'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedContainerProps {
    children: React.ReactNode;
}

export default function AnimatedContainer({ children }: AnimatedContainerProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
    );
}
