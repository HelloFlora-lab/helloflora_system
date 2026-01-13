import React from "react"

const SkeletonImageGallery = () => {
  return (
    <div className="flex flex-col small:flex-row items-start gap-4 animate-pulse">
      {/* Miniature verticali (Desktop) */}
      <div className="hidden small:flex flex-col gap-2 h-[768px]">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="aspect-[3/4] bg-gray-200 rounded-lg"
            style={{ 
              height: "calc((768px - 24px) / 4)",
              width: "calc(((768px - 24px) / 4) * 0.75)"
            }} 
          />
        ))}
      </div>

      {/* Immagine principale */}
      <div className="relative flex-1 w-full small:max-w-xl aspect-[3/4] bg-gray-200 rounded-lg small:h-[768px]"></div>

      {/* Miniature orizzontali (Mobile) */}
      <div className="flex small:hidden gap-2 mt-2 w-full">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className="flex-1 aspect-[3/4] bg-gray-200 rounded-lg" 
          />
        ))}
      </div>
    </div>
  )
}

export default SkeletonImageGallery
