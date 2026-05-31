"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: (delay: number) => ({
    transition: {
      delayChildren: delay,
      staggerChildren: 0.03,
    },
  }),
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

interface PixelTextProps {
  text: string;
  delay?: number;
}

export function PixelText({ text, delay = 0 }: PixelTextProps) {
  return (
    <motion.span
      variants={container}
      initial="hidden"
      animate="show"
      custom={delay}
      className="inline-block"
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={item}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
