import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="text-3xl-semi uppercase mb-6 text-theme-accent">Bentornato!</h1>
      <p className="text-center text-base-regular">
      Accedi alla nostra area riservata, per un'esperienza di acquisto migliorata.
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2 mb-6">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Inserisci un indirizzo email valido."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            title="Inserisci la tua password."
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full items-center shadow-none rounded-2xl border border-transparent bg-theme-main hover:bg-theme-accent px-7 py-3 text-center text-base font-medium text-white hover:text-white mt-5">
          Accedi
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Non sei ancora registrato?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline"
          data-testid="register-button"
        >
          Registrati ora
        </button>
        .
      </span>
    </div>
  )
}

export default Login
