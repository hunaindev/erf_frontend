import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AgencyUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AgencyUpgradeDialog: React.FC<AgencyUpgradeDialogProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  const handleUpgradeClick = () => {
    onOpenChange(false);
    navigate('/subscription');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md rounded-2xl border-0 bg-white p-5 shadow-2xl sm:p-6">
        <DialogTitle className="text-center text-2xl font-bold text-slate-900">
          Ajans Hesabına Yükselt
        </DialogTitle>

        <DialogClose className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-fuchsia-200 bg-white text-fuchsia-600 opacity-100 shadow-sm transition hover:bg-fuchsia-50 focus:outline-none focus:ring-2 focus:ring-fuchsia-200 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Kapat</span>
        </DialogClose>

        <div className="mt-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-5 py-6 text-center shadow-sm">
          <p className="text-base leading-7 text-slate-600">
            Ek markaları yönetebilmek için Ajans hesabına yükselmeniz gerekir.
          </p>
        </div>

        <div className="mt-5">
          <Button
            onClick={handleUpgradeClick}
            className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
          >
            Şimdi Yükselt
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgencyUpgradeDialog;
