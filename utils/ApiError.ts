class ApiError extends Error {
  statusCode: number;
  errors: any[];
  success: boolean;

  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors: any[] = [],
    stack = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export const getGraphQLError = (e: any) =>
  e?.response?.errors?.[0]?.message || "Something went wrong";

export { ApiError };
