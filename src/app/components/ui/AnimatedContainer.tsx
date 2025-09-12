'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedContainerProps {
    readonly children: React.ReactNode;
    readonly isLoading?: boolean;
}

export default function AnimatedContainer({ children, isLoading = false }: AnimatedContainerProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoading ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
    );
}
