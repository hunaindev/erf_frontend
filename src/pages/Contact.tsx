import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LocateIcon, Mail, MessageSquare, Phone, Send, Sparkles } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { baseUrl } from "@/utils/constants";

type ContactFormData = {
  name: string;
  email: string;
  instagram: string;
  city: string;
  userType: string;
  interests: string;
  message: string;
  brandPreference: string;
};

const initialForm: ContactFormData = {
  name: "",
  email: "",
  instagram: "",
  city: "",
  userType: "",
  interests: "",
  message: "",
  brandPreference: "",
};

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>(initialForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: ContactFormData) => {
      const { data } = await axios.post(`${baseUrl}/api/contact-us`, payload);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Mesaj başarıyla gönderildi",
        description: "En kısa sürede size geri dönüş yapacağız.",
      });
      setFormData(initialForm);
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },
    onError: () => {
      toast({
        title: "Gönderim başarısız",
        description: "Lütfen bilgilerinizi kontrol edip tekrar deneyin.",
      });
    },
  });

  const setField = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.userType) {
      toast({
        title: "Eksik bilgi",
        description: "Lütfen 'Siz kimsiniz?' alanını seçin.",
      });
      return;
    }

    mutate(formData);
  };

  return (
    <div className="relative isolate flex min-h-screen flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-24 bottom-12 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <Header />

      <main className="flex-1 py-10 md:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 text-center">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
                <Sparkles size={16} />
                İletişim
              </p>
              <h1 className="text-3xl font-bold text-foreground sm:text-5xl">
                Markan için doğru influencer stratejisini birlikte kuralım.
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
                İster marka ister içerik üreticisi olun, ekibimiz taleplerinizi hızlıca değerlendirir
                ve size en uygun akışı önerir.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <section className="glass-morph rounded-3xl p-6 sm:p-8">
                <h2 className="text-2xl font-semibold text-foreground">Bize Ulaşın</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  Kampanya planlama, fiyatlandırma veya platform kullanımı hakkında doğrudan bizimle
                  iletişime geçebilirsiniz.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-background/70 p-4">
                    <span className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                      <Mail size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">E-posta</p>
                      <p className="text-sm text-muted-foreground">İletişim@erfluencer.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-background/70 p-4">
                    <span className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                      <MessageSquare size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Geri Dönüş</p>
                      <p className="text-sm text-muted-foreground">Çoğu mesaja 24 saat içinde dönüş yapıyoruz.</p>
                    </div>
                  </div>

                   <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-background/70 p-4">
                    <span className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                      <Phone size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Telefon numarası</p>
                      <p className="text-sm text-muted-foreground">+90 530 741 59 56</p>
                    </div>
                  </div>

                   <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-background/70 p-4">
                    <span className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                      <LocateIcon size={18} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Adres</p>
                      <p className="text-sm text-muted-foreground"> Aşağı Öveçler Mh. Kabil Cd. 1321. Sk. 2/9, 06460 Çankaya/Ankara, Türkiye</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-primary/20">
                  <img
                    src="/20.jpeg"
                    alt="İletişim görseli"
                    className="h-64 w-full object-cover"
                  />
                </div>
              </section>

              <section className="rounded-3xl border border-primary/20 bg-card p-6 shadow-sm sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Ad Soyad
                      </label>
                      <Input
                        id="name"
                        placeholder="Ad ve Soyad"
                        value={formData.name}
                        onChange={(e) => setField("name", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium">
                        E-posta Adresi
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="info@erfluencer.com"
                        value={formData.email}
                        onChange={(e) => setField("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="instagram" className="mb-2 block text-sm font-medium">
                        Instagram Hesabı
                      </label>
                      <Input
                        id="instagram"
                        placeholder="@influencer.tr"
                        value={formData.instagram}
                        onChange={(e) => setField("instagram", e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="mb-2 block text-sm font-medium">
                        Şehir
                      </label>
                      <Input
                        id="city"
                        placeholder="Şehir"
                        value={formData.city}
                        onChange={(e) => setField("city", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Siz kimsiniz?</label>
                      <Select value={formData.userType} onValueChange={(value) => setField("userType", value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Birini seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="influencer">Influencer</SelectItem>
                          <SelectItem value="brand">Marka</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">İlgi Alanı</label>
                      <Select value={formData.interests} onValueChange={(value) => setField("interests", value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Bir alan seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="art">Sanat ve Fotoğrafçılık</SelectItem>
                          <SelectItem value="automotive">Otomotiv</SelectItem>
                          <SelectItem value="healthcare">Sağlık ve Tıp</SelectItem>
                          <SelectItem value="food">Yeme - İçme</SelectItem>
                          <SelectItem value="beauty">Güzellik ve Moda</SelectItem>
                          <SelectItem value="technology">Teknoloji</SelectItem>
                          <SelectItem value="travel">Seyahat ve Yaşam Tarzı</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-medium">
                      Mesajınız
                    </label>
                    <Textarea
                      id="message"
                      rows={4}
                      placeholder="İhtiyacınızı ve hedefinizi kısaca paylaşın..."
                      value={formData.message}
                      onChange={(e) => setField("message", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="brandPreference" className="mb-2 block text-sm font-medium">
                      Birlikte çalışmak istediğiniz markalar (opsiyonel)
                    </label>
                    <Textarea
                      id="brandPreference"
                      rows={3}
                      placeholder="Örn: güzellik, teknoloji, fitness markaları"
                      value={formData.brandPreference}
                      onChange={(e) => setField("brandPreference", e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-full py-6 text-base font-semibold"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isPending ? "Gönderiliyor..." : "Mesajı Gönder"}
                  </Button>
                </form>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
