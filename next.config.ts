import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // ponytail: pin root so Next doesn't pick a parent lockfile as workspace root
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
