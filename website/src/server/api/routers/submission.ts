import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const submissionsQuery = {
  select: {
    id: true,
    status: true,
    language: true,
    problem: { select: { id: true, title: true } },
    user: { select: { id: true, name: true, image: true } },
  },
  orderBy: { createdAt: "desc" },
} satisfies Prisma.SubmissionFindManyArgs;

export const submissionRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.submission.findFirst({
        where: { id: input.id },
        include: {
          problem: {
            include: {
              testcases: {
                where: { is_example: { equals: true } },
              },
            },
          },
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.submission.findMany(submissionsQuery);
  }),
});
