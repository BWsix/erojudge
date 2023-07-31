import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const problemRouter = createTRPCRouter({
  submit: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        language: z.string(),
        code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const testcases = await ctx.prisma.testcase.findMany({
        where: {
          problemId: { equals: input.id },
        },
        select: {
          input: true,
          output: true,
          timeout: true,
        },
      });

      const body = JSON.stringify({
        code: input.code,
        language: input.language,
        testcases,
      });
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      };
      const res = await fetch(env.COMPILER_URL, options);
      const result = (await res.json()) as {
        status: string;
        message: string;
      };
      return await ctx.prisma.submission.create({
        data: {
          problemId: input.id,
          code: input.code,
          language: input.language,
          status: result.status,
          message: result.message,
          userId: ctx.session.user.id,
        },
      });
    }),

  getDescription: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.problem.findUnique({
        where: { id: input.id },
        include: {
          testcases: {
            where: { is_example: { equals: true } },
            select: {
              input: true,
              output: true,
            },
          },
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.problem.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }),
});
