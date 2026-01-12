import qs from "qs";


export const getFaq = async (countryCode: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
    const path = "/api/faqs";

    const url = new URL(path, baseUrl);


    try {
        url.search = qs.stringify({
             populate: '*'});

        const res = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json"},
            //cache: "force-cache",
        });

    if (!res.ok) throw new Error("Failed to fetch FAQs");

    const data = await res.json();
    console.log(data);

    return data;
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        return null;
    }
}