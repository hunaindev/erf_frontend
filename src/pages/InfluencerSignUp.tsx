import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  EyeIcon,
  EyeOffIcon,
  Globe2,
  MapPin,
  Phone,
} from "lucide-react";

import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { baseUrl } from "@/utils/constants";

type InfluencerFormData = {
  firstName: string;
  lastName: string;
  email: string;
  emailConfirmation: string;
  password: string;
  passwordConfirmation: string;
  city: string;
  country: string;
  contact: string;
};

const initialForm: InfluencerFormData = {
  firstName: "",
  lastName: "",
  email: "",
  emailConfirmation: "",
  password: "",
  passwordConfirmation: "",
  city: "",
  country: "",
  contact: "",
};

const InfluencerSignUp: React.FC = () => {
  const [form, setForm] = useState<InfluencerFormData>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const updateField = (field: keyof InfluencerFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.email !== form.emailConfirmation) {
      toast({
        title: "E-posta uyuşmuyor",
        description: "E-posta adreslerinizin eşleştiğinden emin olun.",
        variant: "destructive",
      });
      return;
    }

    if (form.password !== form.passwordConfirmation) {
      toast({
        title: "Şifre uyuşmuyor",
        description: "Şifrelerinizin eşleştiğinden emin olun.",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "Onay gerekli",
        description: "Devam etmek için sözleşme ve politikaları kabul edin.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const payload = JSON.stringify({
      name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      city: form.city,
      address: "",
      country: form.country,
      unit: "",
      state: "",
      postal_code: "",
      password: form.password,
      role: "influencer",
      contact: form.contact,
    });

    try {
      const response = await axios.request({
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/api/signup-influencer`,
        headers: { "Content-Type": "application/json" },
        data: payload,
      });

      if (response.data.status === 400) {
        toast({
          title: response.data.validator?.email?.[0] || "Kayıt başarısız",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Hesap Oluşturuldu",
          description:
            "Influencer hesabınız başarıyla oluşturuldu. Lütfen e-posta adresinizi doğrulayın.",
        });
        navigate("/verify-email");
      }, 900);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Bir hata oluştu",
        description: "Lütfen tekrar deneyin.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background transition-colors duration-500">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <Header />

      <main className="flex-grow flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-3xl px-6">
            <section className="rounded-3xl border border-primary/20 bg-card p-6 shadow-sm sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Hesap Bilgileri</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium">
                      Ad
                    </label>
                    <Input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium">
                      Soyad
                    </label>
                    <Input
                      id="lastName"
                      value={form.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      E-posta
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="emailConfirmation" className="block text-sm font-medium">
                      E-posta Doğrulama
                    </label>
                    <Input
                      id="emailConfirmation"
                      type="email"
                      value={form.emailConfirmation}
                      onChange={(e) => updateField("emailConfirmation", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground">Şifre</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium">
                      Şifre
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                        value={form.password}
                        onChange={(e) => updateField("password", e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        aria-label="Şifreyi goster"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="passwordConfirmation" className="block text-sm font-medium">
                      Şifre Doğrulama
                    </label>
                    <div className="relative">
                      <Input
                        id="passwordConfirmation"
                        type={showPasswordConfirmation ? "text" : "password"}
                        className="pr-10"
                        value={form.passwordConfirmation}
                        onChange={(e) => updateField("passwordConfirmation", e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        aria-label="Şifreyi goster"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowPasswordConfirmation((prev) => !prev)}
                      >
                        {showPasswordConfirmation ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground"> Konum ve İletişim</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="city" className="block text-sm font-medium">
                      Şehir
                    </label>
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        id="city"
                        className="pl-9"
                        value={form.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="country" className="block text-sm font-medium">
                      Ülke
                    </label>
                    <div className="relative">
                      <Globe2
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        id="country"
                        className="pl-9"
                        value={form.country}
                        onChange={(e) => updateField("country", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="contact" className="block text-sm font-medium">
                       İletişim Numarası
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                      <Input
                        id="contact"
                        type="tel"
                        className="pl-9"
                        value={form.contact}
                        onChange={(e) => updateField("contact", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-background/70 p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="termsAndConditions"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  />
                  <label htmlFor="termsAndConditions" className="text-sm leading-6 text-foreground/90">
                    Kabul ediyorum:
                    {" "}
                    <Link to="/terms" className="text-primary underline">
                      Hizmet Sartlari
                    </Link>
                    ,{" "}
                    <Link to="/agreement" className="text-primary underline">
                      Influencer Sözleşmesi
                    </Link>
                    {" "}ve{" "}
                    <Link to="/privacy" className="text-primary underline">
                      Gizlilik Politikasi
                    </Link>
                    .
                  </label>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full rounded-full py-6 text-base font-semibold">
                {isLoading ? "Hesap Oluşturuluyor..." : "Hesap Oluştur"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Zaten Hesabın Var mı ?{" "}
                <Link to="/signin" className="font-medium text-primary hover:underline">
                  Giriş Yap
                </Link>
              </p>
            </form>
            </section>
        </div>
      </main>
    </div>
  );
};

export default InfluencerSignUp;
