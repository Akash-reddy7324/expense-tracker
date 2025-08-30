/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",     // ✅ replaces `next export`
  typedRoutes: true     // ✅ no longer inside experimental
};

export default nextConfig;   // ✅ use ESM (Next.js 15 standard)
