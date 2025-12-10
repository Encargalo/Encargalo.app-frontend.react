import { X } from "lucide-react";

const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white sm:rounded-xl p-6 relative min-w-[320px] max-w-lg w-full h-dvh sm:h-max">
            <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={onClose}
            >
                <X className="size-5" />
            </button>
            {children}
        </div>
    </div>
);

export default Modal;