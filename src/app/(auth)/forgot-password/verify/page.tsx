import { ForgotPasswordStepPage } from "@/features/auth/ui/forgot-password-step-page"

type VerifyResetPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const VerifyResetPage = ({ searchParams }: VerifyResetPageProps) => {
  return <ForgotPasswordStepPage searchParams={searchParams} step="verify" />
}

export default VerifyResetPage
