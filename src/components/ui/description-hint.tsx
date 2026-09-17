type DescriptionHintProps = {
  error: string
  hint: string
  length: number
  limit: number
  invalidCount: boolean
}

export const DescriptionHint = ({
  error,
  hint,
  length,
  limit,
  invalidCount,
}: DescriptionHintProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      {error ? (
        <p className="text-destructive text-xs">{error}</p>
      ) : (
        <p className="text-muted-foreground text-xs">{hint}</p>
      )}
      <p
        className={
          invalidCount
            ? "text-destructive text-xs"
            : "text-muted-foreground text-xs"
        }
      >
        {length}/{limit}
      </p>
    </div>
  )
}
