import { redirect } from "next/navigation"
import { ForgotPasswordView } from "./forgot-password-view"

type ForgotPasswordStep = "verify" | "reset"

type ForgotPasswordStepPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  step: ForgotPasswordStep
}

const getSearchEmail = (value: string | string[] | undefined) => {
  if (typeof value === "string") {
    return value
  }

  return ""
}

export const ForgotPasswordStepPage = async ({
  searchParams,
  step,
}: ForgotPasswordStepPageProps) => {
  const email = getSearchEmail((await searchParams).email)

  if (!email) {
    redirect("/forgot-password")
  }

  return <ForgotPasswordView step={step} email={email} />
}
