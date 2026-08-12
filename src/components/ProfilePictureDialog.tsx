
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Crop, RotateCcw, Maximize, X, Check } from 'lucide-react';

interface ProfilePictureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfilePictureDialog: React.FC<ProfilePictureDialogProps> = ({ open, onOpenChange }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      onOpenChange(false);
      toast({
        title: "Profil fotoğrafı güncellendi",
        description: "Profil fotoğrafınız başarıyla güncellendi.",
      });
    }, 1500);
  };

  const resetImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (

    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profil Fotoğrafını Güncelle</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative w-40 h-40 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Profil önizleme"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <span className="text-sm">Seçili görsel yok</span>
                </div>
              )}
            </div>
          </div>

          {selectedImage && (
            <div className="flex justify-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => console.log('Crop')}>
                <Crop size={16} className="mr-1" /> Kırp
              </Button>
              <Button variant="outline" size="sm" onClick={() => console.log('Zoom')}>
                <Maximize size={16} className="mr-1" /> Yakınlaştır
              </Button>
              <Button variant="outline" size="sm" onClick={() => console.log('Rotate')}>
                <RotateCcw size={16} className="mr-1" /> Döndür
              </Button>
              <Button variant="outline" size="sm" onClick={resetImage}>
                <X size={16} className="mr-1" /> Sıfırla
              </Button>
            </div>
          )}

          <div className="mt-4">
            {!selectedImage ? (
              <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                  <div className="text-sm text-gray-500 mt-2">
                    Görselinizi Buraya Sürükleyip Bırakın
                    <br />
                    VEYA
                    <br />
                    <button
                      className="text-primary font-medium hover:underline mt-2"
                      onClick={handleBrowseClick}
                    >
                      Dosyaları Seç
                    </button>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isUploading} className="w-full">
                  {isUploading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog >
  );
};

export default ProfilePictureDialog;
