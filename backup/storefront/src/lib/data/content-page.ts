import qs from "qs";


export const getContentPages = async (countryCode?: string, slug?: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
    const path = "/api/contentpages";

    const url = new URL(path, baseUrl);

    console.log(url.toString());

    try {
        url.search = qs.stringify({
            populate: {
                
            seo: {
                fields: ["metaTitle", "metaDescription"],
                },

            },

        filters: slug ? {
            slug: {
                $eq: slug, // This is the slug for post
            },
        } : {},
        });

        console.log(url.toString());
    const res = await fetch(url.toString()/*, { cache: "force-cache" }*/);

    if (!res.ok) throw new Error("Failed to fetch blog posts");

    const data = await res.json();
    console.log(data);

    return data;
    } catch (error) {
        console.error("Error fetching blog posts:", error);
        return null;
    }
}