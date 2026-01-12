"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="max-w-sm flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="text-xl-semi uppercase mb-6 text-theme-accent-light text-center">
        Diventa un membro di <span className="text-theme-accent">HelloFlora</span>
      </h1>
      <p className="text-center text-base-regular mb-4">
        Crea il tuo profilo di HelloFlora e accedi a un'esperienza di acquisto migliorata.
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Nome"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label="Cognome"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label="Telefono"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label="Password"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Creando questo account accetti la {" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline"
          >
            <br/>Privacy Policy
          </LocalizedClientLink>{" "}
          e{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline"
          >
            Termini di utilizzo
          </LocalizedClientLink>
          .
        </span>
        <SubmitButton className="w-full items-center shadow-none rounded-2xl border border-transparent bg-theme-main hover:bg-theme-accent px-7 py-3 text-center text-base font-medium text-white hover:text-white mt-5" data-testid="register-button">
          Iscriviti
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Hai già un account?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          Accedi
        </button>
        .
      </span>
    </div>
  )
}

export default Register
