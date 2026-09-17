import { ForgotPasswordStepPage } from "@/features/auth/ui/forgot-password-step-page"

type ResetPasswordPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const ResetPasswordPage = ({ searchParams }: ResetPasswordPageProps) => {
  return <ForgotPasswordStepPage searchParams={searchParams} step="reset" />
}

export default ResetPasswordPage
