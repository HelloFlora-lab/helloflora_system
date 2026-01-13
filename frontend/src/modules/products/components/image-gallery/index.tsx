'use client'
import React, { useState } from "react"
import Image from "next/image"
import { HttpTypes } from "@medusajs/types"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const MAIN_IMAGE_HEIGHT = 768 // px
const THUMB_GAP = 8 // px
const THUMB_COUNT = 4
const THUMB_HEIGHT = (MAIN_IMAGE_HEIGHT - (THUMB_GAP * (THUMB_COUNT - 1))) / THUMB_COUNT

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
        className="relative flex-1 w-full small:max-w-xl overflow-hidden rounded-lg aspect-[3/4] small:h-[768px]"
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
      <div className="flex small:hidden gap-2 mt-2 w-full">
        {images.slice(0, THUMB_COUNT).map((img, idx) => (
         <button
            key={img.id}
            onClick={() => setMainIndex(idx)}
            className={`border rounded-lg overflow-hidden focus:outline-none flex-1 aspect-[3/4] relative filter delay-150 duration-300 ease-in-out hover:brightness-80 ${
              mainIndex === idx ? "border-theme-main" : "border-transparent"
            }`}
            aria-label={`Seleziona immagine ${idx + 1}`}
            type="button"
          >
            <Image
              src={img.url}
              alt={`Miniatura prodotto ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 25vw, 100px"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ImageGallery