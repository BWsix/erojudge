import { type Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { submissionsQuery } from "./submission";

export const userInfoQuerySelect = {
  id: true,
  name: true,
  image: true,
} satisfies Prisma.UserFindManyArgs["select"];

export const userRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findFirst({
        where: { id: input.id },
        select: {
          ...userInfoQuerySelect,
          submission: {
            ...submissionsQuery,
            where: { userId: { equals: input.id } },
          },
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany({ select: userInfoQuerySelect });
  }),
});
