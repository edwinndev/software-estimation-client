export const formatStoryCode = (number: number) =>
  `HU-${String(number).padStart(2, "0")}`

export const storyCodeNumber = (code: string) => {
  if (!code.startsWith("HU-")) {
    return 0
  }

  const value = Number(code.slice(3))
  if (!Number.isInteger(value) || value < 1) {
    return 0
  }

  return value
}

export const nextStoryCode = (codes: string[]) => {
  const max = codes.reduce((highest, code) => {
    const value = storyCodeNumber(code)
    return value > highest ? value : highest
  }, 0)

  return formatStoryCode(max + 1)
}
