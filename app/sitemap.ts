import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://mahirsn.net";

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
        // Add other routes here as site grows, e.g.:
        // {
        //   url: `${baseUrl}/about`,
        //   lastModified: new Date(),
        //   changeFrequency: "monthly",
        //   priority: 0.8,
        // },
    ];
}
