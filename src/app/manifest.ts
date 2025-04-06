import type { MetadataRoute } from "next";

import siteMetadata from "../conf/site-metadata";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: siteMetadata.name,
        short_name: siteMetadata.shortName,
        description: siteMetadata.description,
        start_url: "/",
        display: "standalone",
        // background_color: siteMetadata.bg_color,
        // theme_color: siteMetadata.bg_color,
        // icons: [siteMetadata.appIcon],
    };
}
