import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../server/auth";
import { MoveDown, MoveUp } from "lucide-react";
import Transactions from "@/components/Transactions";
import { api } from "./_trpc/server";
import Logout from "@/components/Logout";
import Greeting from "@/components/Greeting";
import GetMonthlyReport from "@/components/GetMonthlyReport";
import Image from "next/image";

const page = async () => {
  const session = await getServerSession(authOptions);
  const data = await api.transactions.getCalculation();
  const { transactions } = await api.transactions.getAllTransaction();
  return (
    <div>
      <div className="relative bg-gradient-to-r from-[#429690] to-[#429690] h-56 rounded-b-[80px] flex justify-center">
        <div className="absolute left-0 flex flex-col w-full top-12">
          <div className="flex gap-2">
            <Image
              src={session?.user?.image ?? ""}
              alt="No image"
              height={50}
              width={50}
              className="ml-4 rounded-full"
            />
            <div>
              <Greeting />
              <p className=" text-white font-semibold text-xl">
                {session?.user?.name}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-14 right-6">
          <Logout />
        </div>
        <div className="absolute bg-[#2F7E79] w-[350px] top-36 h-48 shadow-lg rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-md text-white font-medium">Total Balance</p>
              <p className="text-2xl text-white font-medium">
                ₹{data?.balance}
              </p>
            </div>
            <div>
              <GetMonthlyReport />
            </div>
          </div>
          <div className="flex justify-between mt-10 px-2 text-white">
            <div className="flex flex-col gap-1">
              <div className="text-gray-300 flex justify-start gap-1">
                <p className="rounded-full border border-white p-1 bg-[#4E918D]">
                  <MoveDown size={16} />
                </p>
                Income
              </div>
              <p>₹{data?.totalIncome}</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-gray-300 flex justify-start gap-1">
                <p className="rounded-full border border-white p-1 bg-[#4E918D]">
                  <MoveUp size={16} />
                </p>
                Expense
              </div>
              <p>₹{data?.totalExpense}</p>
            </div>
          </div>
        </div>
      </div>
      <Transactions transactions={transactions} />
    </div>
  );
};

export default page;
