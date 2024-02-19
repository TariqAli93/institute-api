import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export const prismaInstance = prisma;

export const prismaErrorHandling = (err, errorCode) => {
  if (err instanceof Prisma.PrismaClientValidationError) {
    return {
      error: "Bad Request",
      code: 400,
      errorMessage: err,
    };
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err?.code == "P2025") {
      return {
        error: "Not Found",
        code: 404,
        errorMessage: err,
      };
    }
    if (err?.code == "P2003") {
      return {
        error: "error in field constraints",
        code: 422,
        errorMessage: err,
      };
    }

    if (err?.code == "P2002") {
      return {
        error: "error unique constraint",
        code: 422,
        errorMessage: err,
      };
    }
    return { error: err, code: 401, errorMessage: err.message };
  }

  if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    return { error: "error", code: 500, errorMessage: err.message };
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return { error: "error", code: 500, errorMessage: err.message };
  }

  if (err instanceof Prisma.PrismaClientRustPanicError) {
    return { error: "error", code: 502, errorMessage: err.message };
  } else {
    console.log("Error: " + err.message);
    if (err.kind === "access_denied") {
      return { error: "access_denied", code: 403, errorMessage: err.message };
    }
    return { error: "internal error", code: 500, errorMessage: err };
  }
};
