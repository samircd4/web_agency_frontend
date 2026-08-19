import { api } from "@/lib/api";
import { fetchPublicServices } from "@/lib/services";

const baseUrl = "https://drpythonsolutions.com";

function asArray(data) {
    if (Array.isArray(data)) return data;
    return Array.isArray(data?.results) ? data.results : [];
}

function getIdentifier(item) {
    return item?.slug || item?.id;
}

function getLastModified(value, fallback) {
    const date = value ? new Date(value) : null;
    return date && !Number.isNaN(date.getTime()) ? date : fallback;
}

function createDynamicPages(items, section, dateFields, now) {
    return asArray(items).flatMap((item) => {
        const identifier = getIdentifier(item);
        if (!identifier) return [];

        const lastModifiedValue = dateFields
            .map((field) => item?.[field])
            .find(Boolean);

        return [{
            url: `${baseUrl}/${section}/${encodeURIComponent(identifier)}`,
            lastModified: getLastModified(lastModifiedValue, now),
            changeFrequency: "monthly",
            priority: section === "blog" ? 0.7 : 0.8,
        }];
    });
}

export default async function sitemap() {
    const now = new Date();

    const staticPages = [
        "",
        "/services",
        "/contact",
        "/about",
        "/blog",
        "/portfolio",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: now,
        changeFrequency: route === "/blog" || route === "" ? "daily" : "weekly",
        priority:
            route === ""
                ? 1.0
                : route === "/blog" || route === "/portfolio"
                    ? 0.9
                    : 0.8,
    }));

    const dynamicResults = await Promise.allSettled([
        fetchPublicServices(),
        api.getBlogPosts(),
        api.getPortfolioItems(),
    ]);

    const [servicesResult, postsResult, projectsResult] = dynamicResults;
    dynamicResults.forEach((result, index) => {
        if (result.status === "rejected") {
            const source = ["services", "blog posts", "portfolio projects"][index];
            console.error(`Failed to load ${source} for sitemap:`, result.reason);
        }
    });

    const servicePages = servicesResult.status === "fulfilled"
        ? createDynamicPages(servicesResult.value, "services", ["updated_at", "updatedAt", "created_at", "createdAt"], now)
        : [];
    const blogPages = postsResult.status === "fulfilled"
        ? createDynamicPages(postsResult.value, "blog", ["updated_at", "updatedAt", "published_at", "publishedAt", "created_at", "createdAt"], now)
        : [];
    const portfolioPages = projectsResult.status === "fulfilled"
        ? createDynamicPages(projectsResult.value, "portfolio", ["updated_at", "updatedAt", "created_at", "createdAt"], now)
        : [];

    return [...staticPages, ...servicePages, ...blogPages, ...portfolioPages];
}
