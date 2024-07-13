import { appRouter } from "@/server";
import { httpBatchLink } from "@trpc/client";

export const api = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: process.env.url ?? "https://expense-tracker-next-sepia.vercel.app/api/trpc",
    }),
  ],
});
