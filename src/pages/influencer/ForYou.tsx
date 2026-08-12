import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/components/ui/use-toast';
import InfluencerNavbar from '@/components/InfluencerNavbar';
import Footer from '@/components/Footer';
import axios from 'axios';
import { baseUrl, imageUrl } from '@/utils/constants';
import { useNavigate } from "react-router-dom";

// Shimmer Loader Component
const ShimmerCampaignCard = () => (
  <div className="animate-pulse bg-white rounded-lg overflow-hidden shadow-sm border">
    <div className="relative h-32 bg-gray-200 sm:h-40 lg:h-48"></div>
    <div className="p-3">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-5 bg-gray-200 rounded w-5"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

// No Data Found Component
const NoDataFound = () => (
  <div className="text-center py-10 border-t mt-10">
    <div className="inline-block mb-4">
      <img
        src="/lovable-uploads/no-data.png"
        alt="Veri yok"
        className="w-20 h-20 mx-auto"
      />
    </div>
    <p className="text-gray-500">Uygun kampanya bulunamadı</p>
  </div>
);

const ForYou: React.FC = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLike = (id: number) => {
    const data = JSON.stringify({ id });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/like-campaign`, // Corrected endpoint (assumed)
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: data,
    };

    axios.request(config)
      .then((response) => {
        if (response.data.status) {
          toast({
            title: "Kampanya",
            description: "Kampanya başarıyla beğenildi.",
          });
          // Optionally refresh campaigns
          fetchCampaigns();
        } else {
          toast({
            title: "Hata",
            description: response.data.message || "Kampanya begenilemedi.",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        const status = error?.response?.status;
        const message = String(error?.response?.data?.message || '').toLowerCase();
        const isEmptyCampaignResponse =
          status === 404 ||
          status === 204 ||
          message.includes('campaign not found') ||
          message.includes('kampanya bulunamadı') ||
          message.includes('uygun kampanya bulunamadı');

        if (isEmptyCampaignResponse) {
          setCampaigns([]);
          return;
        }

        toast({
          title: "Hata",
          description: "Kampanya begenilemedi. Lütfen tekrar deneyin.",
          variant: "destructive",
        });
        console.error(error);
      });
  };

  const fetchCampaigns = () => {
    setLoading(true);
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/get-influencer-campaign`,
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      params: {
        ...(category ? { category } : {}),
        ...(sort ? { sort } : {}),
      },
    };

    axios.request(config)
      .then((response) => {
        const payload = response.data;
        const nextCampaigns = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.campaigns)
            ? payload.campaigns
            : Array.isArray(payload?.data)
              ? payload.data
              : [];

        setCampaigns(nextCampaigns);
      })
      .catch((error) => {
        toast({
          title: "Hata",
          description: "Kampanyalar Yüklenemedi. Lütfen tekrar deneyin.",
          variant: "destructive",
        });
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCampaigns();
  }, [category, sort]);



  useEffect(() => {

    const user = JSON.parse(localStorage.getItem('user')) || null;

    if (user?.approved_tiktok === 'accept' || user?.approved_instagram === 'accept') {
      navigate('/influencer/for-you');
    } else {
      navigate('/influencer/profile');
    }

  }, [navigate])


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <InfluencerNavbar />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="text-sm">Sırala:</div>
              <Select onValueChange={setSort}>
                <SelectTrigger className="w-40 md:w-60">
                  <SelectValue placeholder="Eski Kampanya" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DESC">Eski Kampanya</SelectItem>
                  <SelectItem value="ASC">En Yeni Kampanya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">Kategori:</div>
              <div className="flex space-x-3">
                <Input
                  type="search"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ara"
                  className="w-40 md:w-60 h-9"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 sm:gap-4">
              {Array(5).fill(0).map((_, index) => (
                <ShimmerCampaignCard key={index} />
              ))}
            </div>
          ) : campaigns.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 sm:gap-4">
              {campaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  to={`/influencer/campaign/${campaign.id}`}
                  className="block h-full rounded-lg border bg-white overflow-hidden shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-32 overflow-hidden sm:h-40 lg:h-48">
                    <img
                      src={`${imageUrl}/${campaign.image}`}

                      alt={campaign.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 p-2.5 sm:p-3">
                    <h3 className="break-words text-sm font-medium leading-tight sm:text-base">{campaign.name}</h3>
                    <p className="mb-2 break-words text-xs leading-snug text-gray-600 sm:text-sm">{campaign.company_name}</p>
                    <div className="mb-2 flex flex-col items-start gap-1.5 text-[11px] leading-snug text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:text-xs">
                      <div>Katılım Tarihi</div>
                      <div className="max-w-full break-all rounded bg-gray-100 px-2 py-0.5 text-[10px] sm:text-xs">{campaign.start_date}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      {/* <button
                        className="text-gray-400 hover:text-red-500"
                        onClick={(e) => {
                          e.preventDefault(); // Prevent Link navigation
                          handleLike(campaign.id);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button> */}
                      <div className="flex items-center text-xs text-blue-500 sm:text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {campaign.count} / 10
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <NoDataFound />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForYou;
