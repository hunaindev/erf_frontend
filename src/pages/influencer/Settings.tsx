import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InfluencerNavbar from '@/components/InfluencerNavbar';
import Footer from '@/components/Footer';
import {
  Instagram,
  PanelRight,
  Grid3X3,
  LayoutGrid,
  Briefcase,
  MapPin
} from 'lucide-react'
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { baseUrl, imageUrl } from '@/utils/constants';

const Shimmer = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
    <div className="space-y-2">
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
      <div className="h-4 w-48 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const InfluencerSettings = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const handlePasswordChanged = () => {
    const data = JSON.stringify({
      "password": password,
      "password_confirmation": confirmPassword,
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/change-password`,
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        if (response.data.message) {
          toast({
            title: "Successfully.",
            description: response.data.message,
          });
          setPassword('')
          setConfirmPassword('')
        } else {
          toast({
            title: "Password Changed",
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
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      },
    };
    axios.request(config)
      .then((response) => {
        setProfile(response.data.user);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <InfluencerNavbar />
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Şifre Değiştir</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">Şifre</label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">Şifreyi Onayla</label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Şifreyi Onayla"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button
                  onClick={handlePasswordChanged}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                >
                  Update
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              {isLoading ? (
                <Shimmer />
              ) : (
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                    {!profile?.image && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    )}
                    {profile?.image && (

                      <img src={`${imageUrl}/${profile?.image}`} alt="" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{profile?.name}</h3>
                    <p className="text-sm text-gray-600">{profile?.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InfluencerSettings;
