"use client";
import { transactionType } from "@prisma/client";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/app/_trpc/react";
import { useRouter } from "next/navigation";

const AddTrModal = ({
  setIsModalOpen,
  isModalOpen,
}: {
  setIsModalOpen: (open: boolean) => void;
  isModalOpen: boolean;
}) => {
  const transactionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    amount: z.string().min(1, "Amount is required"),
    transType: z.nativeEnum(transactionType),
  });
  const router = useRouter();

  type TransactionSchemaType = z.infer<typeof transactionSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionSchemaType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: "",
      amount: "",
      transType: undefined,
    },
  });
  const { mutate } = api.transactions.addTransaction.useMutation({
    onSuccess: () => {
      alert("Transaction added");
      router.refresh();
      reset();
    },
    onError: (err) => {
      console.log(err);
      router.refresh();
      reset();
    },
  });

  const onSubmit = (data: TransactionSchemaType) => {
    // Handle form submission logic here
    mutate(data);
    console.log(data);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Transaction Name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Transaction Type
                </label>
                <select
                  {...register("transType")}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
                {errors.transType && (
                  <p className="text-red-500 text-sm">
                    {errors.transType.message}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  type="text"
                  {...register("amount")}
                  className="mt-1 p-2 w-full border rounded-md"
                  required
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm">
                    {errors.amount.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTrModal;
