import React from "react";
import { TrashIcon } from "lucide-react";

const DeleteConfirmationModal = ({
  isOpen,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  if (!isOpen) return null;

  const handleCancel = () => {
    onCancel();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Confirm Deletion</h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-600 focus:outline-none"
          >
            <TrashIcon size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to delete this transaction?
        </p>
        <div className="flex justify-end">
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
