import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/blog/fillomino-vs-sudoku-differences',
        destination: '/blog/fillomino-vs-sudoku',
        permanent: true,
      },
      {
        source: '/blog/best-brain-puzzle-games-2026',
        destination: '/blog/best-free-logic-puzzles-2026',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
