import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin/", "/private/"], // Example private routes
        },
        sitemap: "https://mahirsn.net/sitemap.xml",
    };
}
