export const UserStatus = ({ isActive }: { isActive: boolean }) => {
  return (
    <span className={isActive ? "text-green-500" : "text-red-500"}>
      {isActive ? "Activo" : "Suspendido"}
    </span>
  )
}
