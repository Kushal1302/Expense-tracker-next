import { prisma } from "@/lib/prisma";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { hashedPassword } from "@/lib/auth";
import { TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { transactionType } from "@prisma/client";

export const transactionRouter = router({
  getAllTransaction: publicProcedure.query(async () => {
    const session = await getServerSession(authOptions);
    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });
    const transactions = await prisma.transactions.findMany({
      where: {
        userId: user?.id,
      },
      orderBy:{
        createdAt:'desc'
      }
    });
    return {
      transactions,
    };
  }),
  getCalculation: publicProcedure.query(async () => {
    try {
      const session = await getServerSession(authOptions);
      const user = await prisma.user.findFirst({
        where: {
          email: session?.user?.email,
        },
      });
      const income = await prisma.transactions.findMany({
        where: {
          userId: user?.id,
          transType: "INCOME",
        },
        select: {
          amount: true,
        },
      });
      const expense = await prisma.transactions.findMany({
        where: {
          userId: user?.id,
          transType: "EXPENSE",
        },
        select: {
          amount: true,
        },
      });
      const totalIncome = income.reduce(
        (sum, transaction) => sum + parseFloat(transaction.amount ?? ""),
        0
      );
      const totalExpense = expense.reduce(
        (sum, transaction) => sum + parseFloat(transaction.amount ?? ""),
        0
      );
      return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
    }
  }),
  addTransaction: publicProcedure
    .input(
      z.object({
        name: z.string(),
        amount: z.string(),
        transType: z.nativeEnum(transactionType),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const session = await getServerSession(authOptions);
        const user = await prisma.user.findFirst({
          where: {
            email: session?.user?.email,
          },
        });
        await prisma.transactions.create({
          data: {
            name: input.name,
            amount: input.amount,
            transType: input.transType,
            userId: user?.id ?? "",
          },
        });
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
      }
    }),
});
