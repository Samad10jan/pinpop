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

export const getGraphQLError = (e: any) => {
  const raw =
    e?.response?.errors?.[0]?.message ||
    e?.message ||
    "Something went wrong";

// get last line of error message
  const lines = raw.split("\n").map((l:any) => l.trim()).filter(Boolean);

  return lines[lines.length - 1];
};

export { ApiError };
