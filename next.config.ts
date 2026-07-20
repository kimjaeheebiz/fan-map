import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    // Prevent Turbopack from inferring a broader workspace root and
    // spawning runaway worker processes on Windows.
    root: projectRoot,
  },
};

export default nextConfig;
