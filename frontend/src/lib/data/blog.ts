import qs from "qs";


export const getBlogPosts = async (
  countryCode: string, 
  slug?: string, 
  page: number = 1, 
  pageSize: number = 6
) => {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
    const path = "/api/articles";

    const url = new URL(path, baseUrl);

    try {
        url.search = qs.stringify({
            sort: ['createdAt:desc'],
            pagination: {
                page: page,
                pageSize: pageSize
            },
            populate: {
                cover: {
                    fields: ["alternativeText", "name", "url"],
                },
            },
            filters: slug ? {
                slug: {
                    $eq: slug,
                },
            } : {},
        });

        const res = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json"},
            // cache: "no-store" // Decommenta se vuoi dati sempre freschi
        });

        if (!res.ok) throw new Error("Failed to fetch blog posts");

        const data = await res.json();
        return data; // Strapi restituisce { data: [...], meta: { pagination: ... } }
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return null;
    }
}