'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ScrollReveal({ children, className = "", width = "100%", delay = 0, y = 20 }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className={className} style={{ width, opacity: 0 }}>{children}</div>;
    }

    return (
        <div className={className} style={{ position: "relative", width, overflow: "visible" }}>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: delay, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
            >
                {children}
            </motion.div>
        </div>
    );
}
