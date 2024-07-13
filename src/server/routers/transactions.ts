import { prisma } from "@/lib/prisma";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import { hashedPassword } from "@/lib/auth";
import { TRPCError } from "@trpc/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { transactionType } from "@prisma/client";

export const transactionRouter = router({
  getAllTransaction: publicProcedure.query(async () => {
    const session = await getServerSession(authOptions);
    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });
    // Get current month and year
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-based index
    const currentYear = new Date().getFullYear();

    // Calculate start and end date for the current month
    const startDate = new Date(currentYear, currentMonth - 1, 1); // Month is 0-indexed
    const endDate = new Date(currentYear, currentMonth, 0); // Last day of current month
    const transactions = await prisma.transactions.findMany({
      where: {
        userId: user?.id,
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
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
      // Get current month and year
      const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-based index
      const currentYear = new Date().getFullYear();

      // Calculate start and end date for the current month
      const startDate = new Date(currentYear, currentMonth - 1, 1); // Month is 0-indexed
      const endDate = new Date(currentYear, currentMonth, 0); // Last day of current month
      const income = await prisma.transactions.findMany({
        where: {
          userId: user?.id,
          transType: "INCOME",
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
        select: {
          amount: true,
        },
      });
      const expense = await prisma.transactions.findMany({
        where: {
          userId: user?.id,
          transType: "EXPENSE",
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
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
        return {
          message: "Transaction added",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
      }
    }),
  deleteTransactionById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await prisma.transactions.delete({
          where: {
            id: input.id,
          },
        });
        return {
          message: "Transaction deleted",
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.log(error);
      }
    }),
});
