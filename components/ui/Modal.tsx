import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from './Card';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-md mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>{title}</CardTitle>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
            <Button variant="danger" onClick={onConfirm}>
              {confirmText}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Modal;
