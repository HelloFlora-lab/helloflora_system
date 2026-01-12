import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-6 flex items-center justify-between">
      <div>
        <h2 className="h3-style">
         Hai un account HelloFlora?
        </h2>
        <p className="mt-2">
          Accedi al tuo account per un'esperienza di acquisto su misura. Potrai salvare i tuoi preferiti, velocizzare il checkout con i dati precompilati e monitorare facilmente lo storico dei tuoi ordini.
        </p>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button className="flex items-center shadow-none items-center rounded-full border border-white/30 bg-theme-accent hover:bg-theme-secondary-light px-5 py-3 text-center text-base font-medium text-white transition-colors" data-testid="sign-in-button">
            Accedi
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
