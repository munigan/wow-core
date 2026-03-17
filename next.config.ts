import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	cacheComponents: true,
	cacheLife: {
		armory: {
			stale: 86400,
			revalidate: 86400,
			expire: 604800,
		},
	},
};

export default nextConfig;
