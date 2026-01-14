import { formatDateToItalian } from "@lib/util/format-date";
import { getShortText } from "@lib/util/short-text";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Image from "next/image";

export interface BlogPostCardProps {
    id: number;
    title: string;
    slug: string;
    description: string;
    cover: {
      id: number;
      documentId: string;
      alternativeText: string;
      name: string;
      url: string;
    };
    publishedAt: string;

}

export const BlogPostCard = ({ title, slug, cover, description, publishedAt }: Readonly<BlogPostCardProps>) => {

  return (
    <>
      <div className="w-full px-4 md:w-1/2 lg:w-1/3">
        <div className="mb-10 w-full">
          <div className="mb-8 overflow-hidden rounded">
             <LocalizedClientLink href={`/blog/${slug}`} title={title}>
              <Image
                  src={cover.url}
                  alt={cover.alternativeText || cover.name}
                  width={200}
                  height={200}
                  className="w-full rounded-lg shadow-md"
              />
            </LocalizedClientLink>
          </div>
          <div>
            {publishedAt && (
              <span className="mb-5 inline-block rounded bg-theme-accent px-4 py-1 text-center text-xs font-semibold leading-loose text-white">
                {formatDateToItalian(publishedAt)}
              </span>
            )}
            <h3>
              <LocalizedClientLink
                href={`/blog/${slug}`} title={title}
                className="mb-4 inline-block text-xl font-semibold text-dark hover:text-theme-accent sm:text-2xl lg:text-xl xl:text-2xl"
              >
                {title}
              </LocalizedClientLink>
            </h3>
            <p className="text-base text-body-color dark:text-dark-6">
              {getShortText(description)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
