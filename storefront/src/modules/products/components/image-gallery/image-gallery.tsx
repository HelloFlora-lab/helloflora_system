'use client'
import React, { useState } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const MAIN_IMAGE_HEIGHT = 768 // px
const MAIN_IMAGE_WIDTH_MOBILE = 576 // px
const THUMB_GAP = 8 // px
const THUMB_COUNT = 4
const THUMB_HEIGHT = (MAIN_IMAGE_HEIGHT - (THUMB_GAP * (THUMB_COUNT - 1))) / THUMB_COUNT
const THUMB_WIDTH_MOBILE = (MAIN_IMAGE_WIDTH_MOBILE - (THUMB_GAP * (THUMB_COUNT - 1))) / THUMB_COUNT

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  // DEBUG: Stampa l'array di immagini ricevuto per verificarne il contenuto
  console.log("DEBUG: Immagini ricevute nella ImageGallery:", images);

  const [mainIndex, setMainIndex] = useState(0)
  const mainImage = images[mainIndex]

  return (
    <div className="flex flex-col small:flex-row items-start gap-4">
      {/* Miniature verticali */}
      <div
        className="hidden small:flex flex-col"
        style={{ height: MAIN_IMAGE_HEIGHT }}
      >
        {images.slice(0, THUMB_COUNT).map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setMainIndex(idx)}
            className={`border rounded-lg overflow-hidden focus:outline-none w-20 aspect-[3/4] filter delay-150 duration-300 ease-in-out hover:brightness-80 ${
              mainIndex === idx ? "border-theme-main" : "border-transparent"
            }`}
            style={{
              height: THUMB_HEIGHT,
              width: (THUMB_HEIGHT * (3 / 4)),
              marginBottom: idx < THUMB_COUNT - 1 ? THUMB_GAP : 0,
            }}
            aria-label={`Seleziona immagine ${idx + 1}`}
            type="button"
          >
            <Image
              src={img.url}
              alt={`Miniatura prodotto ${idx + 1}`}
              width={Math.round(THUMB_HEIGHT * (3 / 4))}
              height={Math.round(THUMB_HEIGHT)}
              className="object-cover w-full h-full aspect-[3/4]"
            />
          </button>
        ))}
      </div>
      {/* Main image */}
      <div
        className="relative flex-1 w-full max-w-xl overflow-hidden rounded-lg aspect-[3/4]"
        style={{ height: MAIN_IMAGE_HEIGHT }}
      >
        {mainImage && (
          <Image
            src={mainImage.url}
            alt="Immagine principale prodotto"
            fill
            sizes="(max-width: 576px) 400px, (max-width: 768px) 600px, (max-width: 992px) 800px, 1200px"
            className="object-cover rounded-lg aspect-[3/4]"
            priority
          />
        )}
      </div>
      {/* Miniature mobile */}
      <div className={`flex small:hidden gap-[${THUMB_GAP}px] mt-2`}>
        {images.slice(0, THUMB_COUNT).map((img, idx) => (
         <button
            key={img.id}
            onClick={() => setMainIndex(idx)}
            className={`border rounded-lg overflow-hidden focus:outline-none w-20 aspect-[3/4] filter delay-150 duration-300 ease-in-out hover:brightness-80 ${
              mainIndex === idx ? "border-theme-main" : "border-transparent"
            }`}
            style={{
              height: THUMB_HEIGHT,
              width: THUMB_WIDTH_MOBILE,
              marginBottom: idx < THUMB_COUNT - 1 ? THUMB_GAP : 0,
            }}
            aria-label={`Seleziona immagine ${idx + 1}`}
            type="button"
          >
            <Image
              src={img.url}
              alt={`Miniatura prodotto ${idx + 1}`}
              width={Math.round(THUMB_WIDTH_MOBILE)}
              height={Math.round(THUMB_HEIGHT)}
              className="object-cover w-full h-full aspect-[3/4]"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ImageGallery