import { redirect } from "next/navigation"
import { ForgotPasswordView } from "./forgot-password-view"

type ForgotPasswordStep = "verify" | "reset"

type ForgotPasswordStepPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  step: ForgotPasswordStep
}

const getSearchValue = (value: string | string[] | undefined) => {
  if (typeof value === "string") {
    return value
  }

  return ""
}

export const ForgotPasswordStepPage = async ({
  searchParams,
  step,
}: ForgotPasswordStepPageProps) => {
  const params = await searchParams
  const email = getSearchValue(params.email)
  const code = getSearchValue(params.code)

  if (!email) {
    redirect("/forgot-password")
  }

  if (step === "reset" && !code) {
    redirect(`/forgot-password/verify?email=${encodeURIComponent(email)}`)
  }

  return <ForgotPasswordView step={step} email={email} code={code} />
}
