"use client"

import Instagram from "@modules/common/icons/instagram"
import Facebook from "@modules/common/icons/facebook"
import TikTok from "@modules/common/icons/tiktok"
import Pinterest from "@modules/common/icons/pinterest"

const SocialLinks = () => {
  return (
    <>
            <a
              href="https://www.instagram.com/helloflora.official"
              title="Visita il nostro Instagram"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ui-fg-base"
              >
               <Instagram className="text-white" size={22} />
            </a>
             <a
              href="https://www.tiktok.com/@helloflora.official"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ui-fg-base"
              title="Visita il nostro TikTok"
              >
             <TikTok className="text-white" size={22} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ui-fg-base"
              title="Visita il nostro Facebook"
              >
                <Facebook className="text-white" size={22} />
            </a>
            <a
              href="https://pinterest.com/helloflora"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ui-fg-base"
              title="Visita il nostro Pinterest"
              >
                <Pinterest className="text-white" size={22} />
            </a>
             
    </>
  )
}

export default SocialLinks
