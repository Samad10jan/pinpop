import { GraphQLError } from "graphql";

class ApiError extends GraphQLError {
  statusCode: number;
  success: boolean;

  private static getCodeFromStatus(status: number) {
    if (status === 400) return "BAD_REQUEST";
    if (status === 401) return "UNAUTHORIZED";
    if (status === 403) return "FORBIDDEN";
    if (status === 404) return "NOT_FOUND";
    return "INTERNAL_SERVER_ERROR";
  }

  constructor(statusCode: number, message = "Something went wrong") {
    super(message, {
      extensions: {
        statusCode,
        code: ApiError.getCodeFromStatus(statusCode),
        success: false,
      },
    });

    this.statusCode = statusCode;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }

}

export const getGraphQLError = (e: any): string => {
  const err = e?.response?.errors?.[0];

  if (err) return err.message;

  if (typeof e?.message === "string") return e.message;

  return "Something went wrong";
};

export { ApiError };

