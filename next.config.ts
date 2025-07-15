import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 웹 성능 최적화
  poweredByHeader: false,

  // 이미지 최적화 (Firebase Storage 이미지들)
  images: {
    domains: ['firebasestorage.googleapis.com'],
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;
