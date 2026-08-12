import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import MobileBackButton from "@/components/MobileBackButton";
import { baseUrl } from "@/utils/constants";
import axios from "axios";
import { updateExpiredTrials,updateNextBilling } from "./../../api/ApiRoute";
import { useQuery, } from '@tanstack/react-query';

const AdminSignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
            title: "Geçersiz kimlik bilgileri",
          });
          setIsLoading(false);
          return;
        }

        localStorage.setItem("token", JSON.stringify(response.data.token));
        localStorage.setItem("user", JSON.stringify(response.data.user));

        if (response.data.user.role === "admin") {
          setIsLoading(false);
          navigate("/admin/dashboard", { replace: true });
          return;
        }

        setIsLoading(false);
        toast({
          title: "Geçersiz kimlik bilgileri",
        });
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="absolute left-4 top-4">
        <MobileBackButton fallbackPath="/" />
      </div>
      <div className="w-full max-w-md px-6">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Yönetici Portalı</h1>
          <p className="mt-2 text-gray-600">Yönetici paneline güvenli erişim</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Yönetici E-postası
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>

            <Button
              className="w-full bg-primary transition-all duration-200 hover:scale-105 hover:bg-primary/90"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Kimlik doğrulanıyor..." : "Yönetici Paneline Gir"}
            </Button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Sadece yetkili personel. Tüm erişimler izlenir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
