import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, description }: ConfirmModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-card border border-border shadow-2xl rounded-3xl p-8 max-w-md w-full overflow-hidden"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-destructive/10 rounded-2xl text-destructive mb-6">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">{title}</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 order-2 sm:order-1 px-6 py-3 rounded-2xl font-bold text-sm border border-border hover:bg-secondary transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 order-1 sm:order-2 px-6 py-3 rounded-2xl font-bold text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-200 shadow-xl shadow-destructive/20"
              >
                Clear History
              </button>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
