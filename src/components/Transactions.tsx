"use client";
import React, { useState } from "react";
import AddTrModal from "./modals/AddTrModal";
import { api } from "@/app/_trpc/react";
import { transactions } from "@prisma/client";
import { Trash2Icon } from "lucide-react";
import DeleteConfirmationModal from "./modals/DeletModal";
import { useRouter } from "next/navigation";

const Transactions = ({ transactions }: { transactions: transactions[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const router = useRouter();
  const formatDateLabel = (createdAt: Date) => {
    const transactionDate = new Date(createdAt);

    // Format the date consistently as "dd/mm/yyyy"
    const formattedDate = transactionDate.toLocaleDateString("en-GB");

    // Check if it's today
    if (isToday(transactionDate)) {
      return "Today";
    }

    // Check if it's yesterday
    if (isYesterday(transactionDate)) {
      return "Yesterday";
    }

    // Return the formatted date
    return formattedDate;
  };

  const isToday = (someDate: Date) => {
    const today = new Date();
    return (
      someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear()
    );
  };

  const isYesterday = (someDate: Date) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      someDate.getDate() === yesterday.getDate() &&
      someDate.getMonth() === yesterday.getMonth() &&
      someDate.getFullYear() === yesterday.getFullYear()
    );
  };
  const { mutate: DeleteTransaction, isPending: DeletePending } =
    api.transactions.deleteTransactionById.useMutation({
      onSuccess: (data) => {
        setOpenDeleteModal(false);
        alert(data?.message);
        router.refresh();
      },
      onError: (err) => {
        setOpenDeleteModal(false);
        console.log(err.message);
        router.refresh();
      },
    });
  const handleConfirmDelete = () => {
    DeleteTransaction({
      id: transactionId,
    });
  };

  const handleCancelDelete = () => {
    setOpenDeleteModal(false);
  };

  return (
    <div className="mt-36 px-2">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-lg">Transaction History</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#429690] text-white px-4  py-1 rounded-lg shadow hover:bg-[#429690] focus:outline-none"
        >
          Add
        </button>
        <AddTrModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </div>
      <table className="w-full px-8 ">
        <tbody>
          {transactions &&
            transactions.map((transaction) => (
              <tr key={transaction.id} className="w-full">
                <td className="py-4">
                  <div className="flex items-center justify-between bg-white rounded-lg shadow p-4">
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {transaction.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDateLabel(transaction.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-xl font-bold ${
                          transaction.transType === "INCOME"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {transaction.transType === "INCOME" ? "+" : "-"}
                        {transaction.amount}
                      </p>
                      <Trash2Icon
                        size={20}
                        color="red"
                        className="cursor-pointer hover:scale-110"
                        onClick={() => {
                          setOpenDeleteModal(true);
                          setTransactionId(transaction.id);
                        }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <DeleteConfirmationModal
        isOpen={openDeleteModal}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        DeletePending={DeletePending}
      />
    </div>
  );
};

export default Transactions;
