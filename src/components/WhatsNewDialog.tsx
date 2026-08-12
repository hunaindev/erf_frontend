
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface WhatsNewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WhatsNewDialog: React.FC<WhatsNewDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-3xl w-full max-w-[95vw] p-0 gap-0 max-h-[90vh] overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 pb-0">
          <h2 className="text-2xl font-bold">Eros'taki Yenilikler</h2>
          {/* <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X size={18} />
          </Button> */}
        </div>

        <div className="p-6 pt-2 overflow-auto max-h-[80vh]">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-500">Yeni</span>
              <h3 className="text-xl font-semibold">Eros Güncellemesi 1.3.0</h3>
            </div>

            <h4 className="font-semibold text-lg mb-2">Yeni Ozellikler</h4>
            <ul className="space-y-4 mb-6">
              <li className="flex gap-2">
                <span className="text-primary font-bold">-</span>
                <div>
                  <span className="font-medium">Basitleştirilmiş Kampanya Oluşturma:</span> Kampanyaları oluşturma ve başlatma sürecinde daha sade adımlar.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">-</span>
                <div>
                  <span className="font-medium">Günlük E-posta Güncellemeleri:</span> Kısa ve faydalı günlük özetler doğrudan gelen kutunuza gelir.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">-</span>
                <div>
                  <span className="font-medium">"Nasıl Yapılır" Bolumu:</span> Platformu daha verimli kullanmaniza yardimci olan adim adim rehber.
                </div>
              </li>
            </ul>

            <h4 className="font-semibold text-lg mb-2">Iyilestirmeler</h4>
            <ul className="space-y-4 mb-6">
              <li className="flex gap-2">
                <span className="text-primary font-bold">-</span>
                <div>
                  <span className="font-medium">Gelismis Kampanya Takibi:</span> Influencer paylasimlarini kampanya icinde daha net ve gercek zamanli goruntuleyin.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">-</span>
                <div>
                  <span className="font-medium">Gelismis Yeni Akis:</span> Devam eden kampanyalarda influencer aktivitelerini daha kolay takip edin.
                </div>
              </li>
            </ul>

            <h4 className="font-semibold text-lg mb-2">Hata Duzeltmeleri</h4>
            <ul className="space-y-4">
              <li className="flex gap-2">
                <span className="text-primary font-bold">-</span>
                <div>
                  <span className="font-medium">Influencer Durum Güncellemeleri:</span> Durum Değişikliklerinin dogru takibini etkileyen sorunlar giderildi.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">-</span>
                <div>
                  <span className="font-medium">Günlük E-posta Icerigi:</span> Günlük e-posta ozetlerindeki tutarsizliklar duzeltildi.
                </div>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">-</span>
                <div>
                  <span className="font-medium">"Nasıl Yapılır" Bolumu:</span> Rehber bolumundeki hizalama sorunlari duzeltildi.
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="p-4 flex justify-center border-t">
          <Button
            className="bg-primary hover:bg-primary/90 text-white"
            onClick={() => onOpenChange(false)}
          >
            Harika!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsNewDialog;
