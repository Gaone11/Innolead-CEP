import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: "/Innolead-CEP",
  assetPrefix: "/Innolead-CEP/",
};

export default nextConfig;
