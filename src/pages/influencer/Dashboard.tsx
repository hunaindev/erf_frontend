import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import InfluencerNavbar from '@/components/InfluencerNavbar';
import SideMenu from '@/pages/influencer/side-menu'
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import {
  Instagram,
  PanelRight,
  Grid3X3,
  LayoutGrid,
  Briefcase,
  MapPin
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import axios from 'axios';
import { baseUrl } from '@/utils/constants';

const InfluencerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [influencerProfileOpen, setInfluencerProfileOpen] = useState(false);

  // const getInfluencerInDB = () => {

  //   const config = {
  //     method: 'post',
  //     maxBodyLength: Infinity,
  //     url: `${baseUrl}/api/get-influencer-in-db`,
  //     headers: {
  //       'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,

  //     },
  //   };

  //   axios.request(config)
  //     .then((response) => {

  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // useEffect(() => {

  //   getInfluencerInDB()

  // },)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (user.check_profile) {
        setInfluencerProfileOpen(true);

        user.check_profile = false;

        // Save back to localStorage
        localStorage.setItem('user', JSON.stringify(user));

      }
    } catch (error) {
      console.error('Error parsing user from localStorage', error);
    }
  }, []);


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <InfluencerNavbar />

      <SideMenu />

      {/* <Footer /> */}

      <Dialog open={influencerProfileOpen} onOpenChange={setInfluencerProfileOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-2xl border-0 bg-white p-5 shadow-2xl sm:max-w-md sm:p-6">
          <div className="flex flex-col items-center text-center">
            <DialogHeader className="items-center space-y-3 text-center">
              <DialogTitle className="pr-8 text-xl font-semibold text-red-800">
               Uyarı
              </DialogTitle>
              <DialogDescription className="max-w-[18rem] text-sm leading-6 text-red-500 sm:max-w-none sm:text-base">
                Kampanyaları görebilmek için profiline kategori ekle.
              </DialogDescription>
            </DialogHeader>
            <Button
              className="mt-6 w-full rounded-xl bg-red-400 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-red-500 sm:w-auto sm:min-w-[220px]"
              onClick={() => {
                setInfluencerProfileOpen(false);
                navigate('/influencer/profile')
              }}
            >
              Profil Sayfasına Git
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>

  );
};

export default InfluencerDashboard;

