import { UserEditView } from "@/features/users/ui/user-form-view"

type EditUserPageProps = {
  params: Promise<{ userId: string }>
}

const EditUserPage = async ({ params }: EditUserPageProps) => {
  const { userId } = await params
  return <UserEditView userId={userId} />
}

export default EditUserPage
