import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const problemRouter = createTRPCRouter({
  submit: publicProcedure
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
      const output = (await res.json()) as { code: string; message: string };
      return output;
    }),

  getDescription: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.problem.findUniqueOrThrow({
        where: { id: input.id },
        include: {
          testcases: {
            where: { example: { equals: true } },
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

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
