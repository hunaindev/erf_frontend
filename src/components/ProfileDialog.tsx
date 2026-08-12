import React, { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import FormData from 'form-data';
import { baseUrl } from '@/utils/constants';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-5">
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="h-4 w-1/3 rounded bg-gray-200"></div>
        <div className="h-12 rounded-xl bg-gray-200"></div>
        <div className="h-4 w-1/3 rounded bg-gray-200"></div>
        <div className="h-12 rounded-xl bg-gray-200"></div>
        <div className="h-4 w-1/3 rounded bg-gray-200"></div>
        <div className="h-12 rounded-xl bg-gray-200"></div>
        <div className="h-4 w-1/3 rounded bg-gray-200"></div>
        <div className="h-12 rounded-xl bg-gray-200"></div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="h-4 w-1/3 rounded bg-gray-200"></div>
          <div className="h-40 rounded-2xl bg-gray-200"></div>
        </div>
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="h-4 w-1/3 rounded bg-gray-200"></div>
          <div className="h-40 rounded-2xl bg-gray-200"></div>
        </div>
      </div>
      <div className="h-12 rounded-xl bg-gray-200"></div>
    </div>
  );
};

const fieldInputClass =
  'h-12 rounded-xl border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-fuchsia-300 focus:bg-white focus:ring-4 focus:ring-fuchsia-100';

const ProfileDialog: React.FC<ProfileDialogProps> = ({ open, onOpenChange }) => {
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [about, setAbout] = useState('');
  const [id, setId] = useState('');
  const [img, setImg] = useState<any>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/profile`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        const profile = response.data.user;

        if (profile) {
          setContactName(profile?.name || '');
          setEmail(profile?.email || '');
          setPhone(profile?.contact || '');
          setInstagramUsername(profile?.insta_username || '');
          setAbout(profile?.about || '');
          setId(profile?.id || '');
        }

        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const previewUrl = useMemo(() => {
    if (!img || typeof img === 'string') return '';
    return URL.createObjectURL(img);
  }, [img]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImg(file);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    const data = JSON.stringify({
      name: contactName,
      contact: phone,
      email,
      insta_username: instagramUsername,
      about,
      id,
      image: img,
    });

    const formData = new FormData();
    formData.append('image', img);
    formData.append('data', data);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/update-profile`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      data: formData,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.msg === 'error') {
          toast({
            title: response.data.validator.email[0],
            variant: 'destructive',
          });
        }

        localStorage.removeItem('user');
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.dispatchEvent(new Event('user'));
        setIsSubmitting(false);
        onOpenChange(false);

        toast({
          title: 'Profil güncellendi',
          description: 'Profiliniz başarıyla güncellendi.',
        });
      })
      .catch((error) => {
        console.log(error);
        setIsSubmitting(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[calc(100%-2rem)] max-w-3xl flex-col overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-2xl">
        <style>
          {`
            .animate-pulse {
              animation: shimmer 1.5s infinite;
              background: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
              background-size: 200% 100%;
            }
            @keyframes shimmer {
              0% {
                background-position: -200% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }
          `}
        </style>

        <DialogHeader className="border-b border-slate-100 px-5 py-3 sm:px-6">
          <DialogTitle className="text-center text-2xl font-semibold text-slate-900">
            Profili Düzenle
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3 sm:px-6">
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="contactName" className="mb-2 block text-sm font-medium text-slate-700">
                        İletişim Kişisi Adı
                      </label>
                      <input id="id" value={id} onChange={(e) => setId(e.target.value)} type="hidden" />
                      <Input
                        id="contactName"
                        placeholder="Ad soyad girin"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className={fieldInputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
                        Telefon numarası
                      </label>
                      <Input
                        id="phone"
                        placeholder="Örn. +90 555 555 55 55"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={fieldInputClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label htmlFor="instagram" className="mb-2 block text-sm font-medium text-slate-700">
                        Instagram Kullanıcı Adı
                      </label>
                      <Input
                        id="instagram"
                        placeholder="Örn. @kullaniciadi"
                        value={instagramUsername}
                        onChange={(e) => setInstagramUsername(e.target.value)}
                        className={fieldInputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                        E-posta
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Örn. adiniz@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={fieldInputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
                  <label htmlFor="uploadImage" className="mb-3 block text-sm font-medium text-slate-700">
                    Profil görseli yükle
                  </label>

                  <label
                    htmlFor="uploadImage"
                    className="flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-6 text-center transition hover:border-fuchsia-300 hover:bg-fuchsia-50/40"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                      <circle cx="9" cy="9" r="2"></circle>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                    </svg>

                    <div className="mt-3 text-sm leading-6 text-muted-foreground">
                      Görselinizi buraya sürükleyip bırakın
                      <br />
                      veya herhangi bir yere tıklayarak seçin
                    </div>

                    {previewUrl ? (
                      <div className="mt-4">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-sm"
                        />
                      </div>
                    ) : null}
                  </label>

                  <input
                    type="file"
                    id="uploadImage"
                    name="img"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
                  <label htmlFor="about" className="mb-3 block text-sm font-medium text-slate-700">
                    Hakkında
                  </label>
                  <Textarea
                    id="about"
                    className="min-h-[160px] rounded-2xl border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-fuchsia-300 focus:bg-white focus:ring-4 focus:ring-fuchsia-100"
                    placeholder="Kendiniz veya işletmeniz hakkında kısaca bilgi verin (en fazla 150 karakter)."
                    value={about}
                    maxLength={150}
                    onChange={(e) => setAbout(e.target.value)}
                  />
                  <div className="mt-2 text-right text-xs text-slate-400">{about.length}/150</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {!isLoading ? (
          <div className="shrink-0 border-t border-slate-100 bg-white px-5 py-3 shadow-[0_-10px_24px_-18px_rgba(15,23,42,0.2)] sm:px-6">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              {isSubmitting ? 'Güncelleniyor...' : 'Profili Güncelle'}
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
