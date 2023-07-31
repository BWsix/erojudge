import { type Prisma } from "@prisma/client";
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
    .query(async ({ ctx, input }) => {
      const submission = await ctx.prisma.submission.findFirst({
        where: { id: input.id },
        include: {
          problem: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (!submission) return { found: false, submission: undefined };
      if (submission.is_public) return { found: true, submission };
      if (submission.userId === ctx.session?.user.id)
        return { found: true, submission };
      return { found: true, submission: undefined };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.submission.findMany(submissionsQuery);
  }),
});
