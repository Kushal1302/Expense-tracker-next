import { prisma } from "@/lib/prisma";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { hashedPassword } from "@/lib/auth";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
  createUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const hashed = await hashedPassword(input.password);
      const exists = await prisma.user.findFirst({
        where:{
            email:input.email
        }
      })
      if(!exists){
        const user = await prisma.user.create({
            data: {
              email: input.email,
              password: hashed,
            },
          });
      }else{
        throw new TRPCError({
            code:"FORBIDDEN",
            message:"User Already exists"
        })
      }
    }),
});
