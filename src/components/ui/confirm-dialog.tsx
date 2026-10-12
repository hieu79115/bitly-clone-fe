import { useState, useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive",
  isLoading = false,
}: ConfirmDialogProps) {
  // Preserve last valid values so closing animation never flickers or shifts to undefined
  const [cached, setCached] = useState({
    title,
    description,
    confirmText,
    variant,
  });

  useEffect(() => {
    if (isOpen && title) {
      setCached({ title, description, confirmText, variant });
    }
  }, [isOpen, title, description, confirmText, variant]);

  const activeTitle = isOpen ? title : cached.title;
  const activeDescription = isOpen ? description : cached.description;
  const activeConfirmText = isOpen ? confirmText : cached.confirmText;
  const activeVariant = isOpen ? variant : cached.variant;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
        <div className="flex items-start gap-3.5">
          <div
            className={`size-9 rounded-xl flex items-center justify-center shrink-0 shadow-md transition-colors ${
              activeVariant === "destructive"
                ? "bg-rose-600 text-white shadow-rose-500/20"
                : "bg-primary text-primary-foreground shadow-primary/20"
            }`}
          >
            <AlertTriangle className="size-4.5" />
          </div>
          <AlertDialogHeader className="text-left space-y-1">
            <AlertDialogTitle className="text-base font-bold text-slate-900">
              {activeTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed">
              {activeDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <AlertDialogFooter className="flex items-center justify-end gap-2 pt-2 -mx-0 -mb-0 border-t-0 bg-transparent p-0">
          <AlertDialogCancel onClick={onClose} disabled={isLoading} size="sm">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            variant={activeVariant === "destructive" ? "destructive" : "default"}
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className="min-w-[76px] justify-center"
          >
            {isLoading && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
            {activeConfirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
