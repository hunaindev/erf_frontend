import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardNavbar from '@/components/DashboardNavbar';
import Footer from '@/components/Footer';
import { PhoneIcon, MapPinIcon } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { baseUrl, imageUrl } from '@/utils/constants';

const Shimmer = () => (
  <div className="animate-pulse space-y-4">
    <div className="bg-gray-200 rounded-full w-48 h-48 mx-auto mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
      <div className="h-4 w-48 bg-gray-200 rounded"></div>
      <div className="h-4 w-40 bg-gray-200 rounded"></div>
      <div className="h-4 w-64 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const Settings = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const handlePasswordChanged = () => {
    const data = JSON.stringify({
      password,
      password_confirmation: confirmPassword,
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/change-password`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data.message) {
          toast({
            title: 'Basarili',
            description: response.data.message,
          });
          setPassword('');
          setConfirmPassword('');
        } else {
          toast({
            title: 'Şifre Değiştirildi',
            description: response.data.validator.password[0],
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getProfile = () => {
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
        setProfile(response.data.user);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardNavbar />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Ayarlar</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 px-4 md:px-0">
              {isLoading ? (
                <Shimmer />
              ) : (
                <>
                  <div className="bg-gray-100 aspect-square mb-6 rounded-lg flex items-center justify-center">
                    <img
                      src={`${imageUrl}/${profile?.image} || 'https://placehold.co/400x400'`}

                      alt=""
                      className="border border-black rounded-full h-48 w-48 object-cover"
                    />
                  </div>
                  <div className="text-center mb-6">
                    <p className="text-lg font-bold text-gray-900">Ad Soyad: {profile?.name}</p>
                  </div>
                  <div className="space-y-4 text-gray-700">
                    <div className="flex items-center gap-3">
                      <PhoneIcon className="h-5 w-5" />
                      <p>{profile?.contact}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                      <p>{profile?.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPinIcon className="h-5 w-5" />
                      <p>{profile?.about}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="col-span-2 px-4 md:px-0">
              <div className="space-y-6 max-w-lg mx-auto md:mx-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                      Şifre
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Şifre"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                      Şifreyi Onayla
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Şifreyi Onayla"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Button onClick={handlePasswordChanged} className="bg-black hover:bg-black/90 text-white w-full md:w-auto">
                    Güncelle
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;
