import { ZodError } from "zod";

export function formatZodErrors(error: ZodError) {
  return error.issues.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }));
}
