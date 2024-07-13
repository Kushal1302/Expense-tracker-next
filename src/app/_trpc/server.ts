import { appRouter } from "@/server";
import { httpBatchLink } from "@trpc/client";

export const api = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: process.env.url ?? "http://localhost:3000/api/trpc",
    }),
  ],
});
