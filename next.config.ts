import type { NextConfig } from "next";
import { hostname } from "os";

const nextConfig: NextConfig = {
  /* config options here */
  images : {
    remotePatterns : [{
      hostname : "**"
    }],
     unoptimized: true,
  }
};

export default nextConfig;