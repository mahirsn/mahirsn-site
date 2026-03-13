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
                src: "/logo.png",
                sizes: "1744x1744",
                type: "image/png",
            },
        ],
    };
}
