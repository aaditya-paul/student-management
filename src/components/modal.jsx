function Modal({isOpen, onClose, onConfirm, title, desc, cancellable = false}) {
  /**
   * Modal Component
   *
   * A reusable modal dialog that prompts the user to confirm a logout action.
   * Supports optional cancel button and customizable title/description.
   *
   * @component
   *
   * @param {Object} props - Component props
//    * @param {boolean} props.isOpen - Determines whether the modal is visible
   * @param {Function} props.onClose - Callback fired when the modal should be closed (e.g., cancel button)
   * @param {Function} props.onConfirm - Callback fired when the logout is confirmed
   * @param {string} props.title - The title displayed at the top of the modal
   * @param {string} props.desc - The description or message shown in the modal body
   * @param {boolean} [props.cancellable=false] - Whether to show the cancel button (optional, defaults to false)
   *
   * @returns {JSX.Element|null} A modal element when `isOpen` is true, otherwise null
   *
   * @example
   * <Modal
//    *   isOpen={isModalOpen}
   *   onClose={handleClose}
   *   onConfirm={handleLogout}
   *   title="Confirm Logout"
   *   desc="Are you sure you want to log out?"
   *   cancellable={true}
   * />
   */

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-[#1B1C21] p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-white text-xl font-semibold mb-4">{title}</h2>
        <p className="text-gray-300 mb-6">{desc}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 cursor-pointer bg-gray-600 text-white rounded hover:bg-gray-500"
          >
            {cancellable ? "Cancel" : "Close"}
            {/* Cancel */}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 cursor-pointer bg-red-600 text-white rounded hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
