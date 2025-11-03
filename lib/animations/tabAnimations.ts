import { Variants } from "framer-motion";

export const tabContentVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export const tabIndicatorVariants: Variants = {
  initial: { scale: 0.95, opacity: 0.5 },
  active: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

export const imageVariants: Variants = {
  enter: {
    scale: 0.9,
    opacity: 0,
  },
  center: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    scale: 1.1,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export const scrollProgressVariants: Variants = {
  initial: { width: 0 },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  }),
};
