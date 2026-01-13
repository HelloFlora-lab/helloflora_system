"use client";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import { RootNode } from "@strapi/blocks-react-renderer/dist/BlocksRenderer";
import Image from "next/image";

export interface RichTextBlock {
  id: number;
  content: RootNode[]
}

export function RichTextBlock({ block }: { block: RootNode[] }) {
  

    return (
        <div className="richtext">
            <BlocksRenderer
                content={block}
                blocks={{
                    image: ({ image }) => {
                        if (!image) return null;
                        return (
                            <div className="my-6 flex justify-center">
                                <Image
                                    src={image.url}
                                    width={image.width || 800}
                                    height={image.height || 600}
                                    alt={image.alternativeText || ""}
                                    className="rounded-lg shadow-md h-[300px] w-full object-cover"
                                />
                            </div>
                        );
                    },
                }}
            />
        </div>
    );
}