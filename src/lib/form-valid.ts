export type SchemaLike = {
  safeParse: (data: unknown) => { success: boolean }
}

export const isSchemaValid = (schema: SchemaLike, values: unknown) =>
  schema.safeParse(values).success
