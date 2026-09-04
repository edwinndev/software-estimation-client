import Image from "next/image"

export const AuthBrand = () => {
  return (
    <div className="flex justify-center">
      <Image
        src="/logo/Dark.svg"
        alt="Intecx Industries"
        width={180}
        height={48}
        className="h-12 w-auto"
        priority
      />
    </div>
  )
}
