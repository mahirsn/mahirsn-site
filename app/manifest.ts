import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Mahirsn",
        short_name: "Mahirsn",
        description: "Personal website and portfolio of Mahirsn.",
        start_url: "/",
        display: "standalone",
        background_color: "#0a0a0a", // Matches dark theme
        theme_color: "#0a0a0a",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon",
            },
            // Ensure you have these icons or update paths accordingly
            {
                src: "/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icon-1744x1744.png",
                sizes: "1744x1744",
                type: "image/png",
            },
        ],
    };
}
