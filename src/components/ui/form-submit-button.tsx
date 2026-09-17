"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { isSchemaValid, type SchemaLike } from "@/lib/form-valid"

type FormStateSlice = {
  values: unknown
  isSubmitting: boolean
}

type FormWithSubscribe = {
  Subscribe: (props: {
    selector: (state: FormStateSlice) => {
      isValid: boolean
      isSubmitting: boolean
    }
    children: (state: { isValid: boolean; isSubmitting: boolean }) => ReactNode
  }) => ReactNode | Promise<ReactNode>
}

type FormSubmitButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "type" | "disabled" | "form" | "children"
> & {
  form: FormWithSubscribe
  schema: SchemaLike
  isPending?: boolean
  children: ReactNode | ((state: { isBusy: boolean }) => ReactNode)
}

export const FormSubmitButton = ({
  form,
  schema,
  isPending = false,
  children,
  ...props
}: FormSubmitButtonProps) => {
  return (
    <form.Subscribe
      selector={(state) => ({
        isValid: isSchemaValid(schema, state.values),
        isSubmitting: state.isSubmitting,
      })}
    >
      {({ isValid, isSubmitting }) => {
        const isBusy = isSubmitting || isPending

        return (
          <Button type="submit" {...props} disabled={!isValid || isBusy}>
            {typeof children === "function" ? children({ isBusy }) : children}
          </Button>
        )
      }}
    </form.Subscribe>
  )
}
