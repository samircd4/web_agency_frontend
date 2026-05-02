'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ScrollReveal({ children, width = "fit-content", delay = 0, y = 20 }) {
    return (
        <div style={{ position: "relative", width, overflow: "visible" }}>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, margin: "-50px" }}
                transition={{ duration: 0.8, delay: delay, ease: [0.16, 1, 0.3, 1] }}
            >
                {children}
            </motion.div>
        </div>
    );
}
