import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import axios from "axios";

import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { syncStoredPushTokenToBackend } from "@/services/pushNotifications";
import { baseUrl } from "@/utils/constants";
import { updateExpiredTrials,updateNextBilling } from "./../api/ApiRoute";
import { useQuery, } from '@tanstack/react-query';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInfluencer, setIsInfluencer] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();
  const signUpPath = isInfluencer ? "/influencer-signup" : "/brand-signup";

    const {
        data: expiredTrials,
    } = useQuery({
        queryKey: ['updateExpiredTrials'],
        queryFn: updateExpiredTrials,

    });
    const {
        data: nextBilling,
    } = useQuery({
        queryKey: ['updateNextBilling'],
        queryFn: updateNextBilling,

    });

  useEffect(() => {
    const userType = new URLSearchParams(window.location.search).get("type");
    const influencerMode = userType === "influencer";
    setIsInfluencer(influencerMode);
    document.documentElement.classList.toggle("dark", influencerMode);

    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = JSON.stringify({
      email,
      password,
    });

    axios
      .request({
        method: "post",
        maxBodyLength: Infinity,
        url: `${baseUrl}/api/signin`,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
        data,
      })
      .then((response) => {
        if (response.data.message) {
          toast({
            title: response.data.message,
          });
          setIsLoading(false);
          return;
        }

        localStorage.setItem("token", JSON.stringify(response.data.token));
        localStorage.setItem("user", JSON.stringify(response.data.user));
        void syncStoredPushTokenToBackend();

        if (response.data.role === "influencer") {
          localStorage.setItem("tiktok", response.data?.state);
          localStorage.setItem("instagram", response.data?.instagramState);
          setIsInfluencer(true);
          setIsLoading(false);
          navigate("/influencer/dashboard", { replace: true });
          return;
        }

        if (response.data.role === "brand") {
          setIsLoading(false);
          navigate("/dashboard", { replace: true });
          return;
        }

        if (response.data.role === "admin") {
          setIsLoading(false);
         // navigate("/admin/dashboard", { replace: true });
           toast({
            title: 'Invalid credentials',
          });
          return;
        }

        setIsLoading(false);
      })
      .catch((error) => {
        // console.log(error);
        setIsLoading(false);
      });
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
            <div className="mx-auto max-w-md">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold">Tekrar hoş geldiniz</h1>
                <p className="mt-2 text-muted-foreground">
                  Devam etmek için hesabınıza giriş yapın
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    E-posta
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="örnek@örnek.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium">
                    Şifre
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      className="pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      aria-label="Şifreyi göster"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                  </div>

                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Parolanızı mı unuttunuz?
                  </Link>
                </div>

                <div className="rounded-2xl border border-primary/20 bg-background/70 p-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={() => setRememberMe(!rememberMe)}
                    />
                    <label htmlFor="remember" className="cursor-pointer text-sm font-medium">
                      Beni hatırla
                    </label>
                  </div>
                </div>

                <Button
                  className="w-full rounded-full py-6 text-base font-semibold"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Hesabın yok mu?{" "}
                  <Link to={signUpPath} className="font-medium text-primary hover:underline">
                    Kayıt Ol
                  </Link>
                </p>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SignIn;
