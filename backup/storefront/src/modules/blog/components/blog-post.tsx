'use client'

import { useEffect, useState } from "react"
import { Button } from "@medusajs/ui"
import { BlogPostCard, BlogPostCardProps } from "./post-card"
import { getBlogPosts } from "@lib/data/blog"

// Aggiungiamo countryCode alle props perché serve per la chiamata API
type BlogPostProps = {
  countryCode: string
}

const BlogPost = ({ countryCode }: BlogPostProps) => {
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [posts, setPosts] = useState<BlogPostCardProps[]>([])
  const [hasMorePosts, setHasMorePosts] = useState(false)

  const limit = 6 // Numero di post per pagina

  useEffect(() => {
    setLoading(true)

    // Chiamata diretta alla funzione (Client-side fetch)
    // Assicurati che getBlogPosts usi URL pubblici o proxy
    getBlogPosts(countryCode, undefined, page, limit)
      .then((response) => {
        if (response && response.data) {
          const newPosts = response.data
          const meta = response.meta?.pagination

          setPosts((prev) => {
            // Evitiamo duplicati se React renderizza due volte in dev
            const uniqueNewPosts = newPosts.filter(
              (p: BlogPostCardProps) => !prev.some((existing) => existing.id === p.id)
            )
            return [...prev, ...uniqueNewPosts]
          })

          // Verifica se ci sono altre pagine
          if (meta) {
            setHasMorePosts(page < meta.pageCount)
          }
        }
      })
      .catch((err) => {
        console.error("Errore caricamento blog:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page, countryCode]) // Riesegue se cambia pagina o countryCode

  return (
    <div className="flex flex-col w-full">
      {/* Griglia dei Post */}
      <div className="-mx-4 flex flex-wrap">
        {posts.length === 0 && !loading && (
          <div className="w-full px-4 text-center py-10">
            <p>Nessun articolo disponibile al momento.</p>
          </div>
        )}

        {posts.map((postData) => (
          <BlogPostCard
            key={`${postData.id}`}
            {...postData}
          />
        ))}
      </div>

      {/* Pulsante Load More */}
      {hasMorePosts && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="primary" 
            onClick={() => setPage(page + 1)} 
            isLoading={loading}
            className="w-60 items-center shadow-none justify-center rounded-2xl border border-transparent bg-theme-main hover:bg-theme-accent px-7 py-3 text-center text-base font-medium text-white hover:text-white"
          >
            {loading ? "Caricamento..." : "Altri Articoli"}
          </Button>
        </div>
      )}
    </div>
  )
}

export default BlogPost