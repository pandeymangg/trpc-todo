import { publicProcedure, router } from "./trpc";
import db from "./db";
import { z } from "zod";

export const appRouter = router({
  getTodos: publicProcedure.query(() => db),
  getTodo: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(({ input }) => db.find((todo) => todo.id === input.id)),
  addTodo: publicProcedure
    .input(
      z.object({
        title: z.string(),
      })
    )
    .mutation(({ input }) =>
      db.push({
        id: db[db.length - 1].id + 1,
        title: input.title,
      })
    ),
  updateTodo: publicProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string(),
      })
    )
    .mutation(({ input }) => {
      const idx = db.findIndex((todo) => todo.id === input.id);
      db[idx].title = input.title;
    }),
  deleteTodo: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(({ input }) => {
      const idx = db.findIndex((todo) => todo.id === input.id);
      db.splice(idx, 1);
    }),
});

export type AppRouter = typeof appRouter;
