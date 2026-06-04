export default async function sitemap() {
    const baseUrl = "https://drpythonsolutions.com";

    // Define your complete list of static pages including blog and portfolio
    const routes = [
        "",
        "/services",
        "/contact",
        "/about",
        "/checkout",
        "/blog", // Added
        "/portfolio", // Added
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString().split("T")[0],
        changeFrequency: route === "/blog" || route === "" ? "daily" : "weekly", // Crawl blog and homepage more often
        priority:
            route === ""
                ? 1.0
                : route === "/blog" || route === "/portfolio"
                    ? 0.9
                    : 0.8,
    }));

    return routes;
}
