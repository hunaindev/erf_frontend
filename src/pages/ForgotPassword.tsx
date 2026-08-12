
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { forgotPassword } from '../api/ApiRoute';
import { useMutation } from '@tanstack/react-query';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();



    
    const mutation = useMutation({
        mutationFn: forgotPassword,
        onSuccess: (data) => {

           
            toast({
                title: "Reset Link Sent",
                description: "Please check your email for password reset instructions.",
            });
            setIsLoading(false);
        },
        onError: (error) => {
            setIsLoading(false);
            toast({
                title: "Failed",
                description: error.response.data.message,
                variant: "destructive",
            });
        }

    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
       
        mutation.mutate({ email });
        // Mock password reset

    };



  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      {/* Background wrapper */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-background"></div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-screen bg-gradient-to-bl from-primary/5 to-transparent opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-screen bg-gradient-to-tr from-primary/5 to-transparent opacity-60"></div>
      </div>
      
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-md px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Şifreyi Sıfırla</h1>
            <p className="text-muted-foreground mt-2">Sıfırlama bağlantısı almak için e-postanızı girin</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium block">E-posta</label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@ornek.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
            </Button>
            
            <div className="text-center">
              <Link to="/signin" className="text-primary hover:underline text-sm">
                Giriş sayfasına dön
              </Link>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;
