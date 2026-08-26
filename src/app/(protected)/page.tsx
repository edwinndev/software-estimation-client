import { redirect } from "next/navigation";

const ProtectedIndexPage = () => {
  redirect("/projects");
};

export default ProtectedIndexPage;
