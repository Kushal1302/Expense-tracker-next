"use client";
import { api } from "@/app/_trpc/react";
import { LoaderCircle } from "lucide-react";
import React from "react";

const GetMonthlyReport = () => {
  const { mutate, isPending } = api.transactions.getMonthlyReport.useMutation({
    onSuccess: (data) => {
      alert(data?.message);
    },
  });
  return (
    <div>
      <button
        onClick={() => mutate()}
        className="bg-white p-1 rounded-md px-2 text-[#429690] w-[170px] flex justify-center shadow-xl font-semibold"
        disabled={isPending}
      >
        {isPending ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          "Get Monthly Report"
        )}
      </button>
    </div>
  );
};

export default GetMonthlyReport;
