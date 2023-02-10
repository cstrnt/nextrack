import { NODE_ENV } from "$env/static/private";
import { PrismaClient } from "@prisma/client";


declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient();

if (NODE_ENV !== "production") {
  global.prisma = prisma;
}
