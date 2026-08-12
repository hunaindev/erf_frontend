import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import DashboardNavbar from '@/components/DashboardNavbar';
import ProfileDialog from '@/components/ProfileDialog';
import ProfilePictureDialog from '@/components/ProfilePictureDialog';
import CampaignForm from '@/components/CampaignForm';
import Footer from '@/components/Footer';
import { Eye, Edit, Users, Heart, DollarSign, Trash } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import echo from "./echo";
import { toast } from "sonner";
import axios from 'axios';
import { baseUrl, imageUrl } from '@/utils/constants';

// Loading Skeleton Component for Shimmer Effect
const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-40 w-40 bg-gray-200 rounded-full mx-auto"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
  );
};

// Loading Skeleton for Stats Cards
const StatsSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profilePictureDialogOpen, setProfilePictureDialogOpen] = useState(false);
  const [campaignFormOpen, setCampaignFormOpen] = useState(false);
  const [campaignType, setCampaignType] = useState('');
  const [brandInfo, setBrandInfo] = useState('');
  const [data, setData] = useState('');

  const [activeCampaign, setActiveCampaign] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const navigate = useNavigate();
  const [isDelete, setIsDelete] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { toast } = useToast();

  const handleCampaignClick = (type: string) => {
    setCampaignType(type);
    setCampaignFormOpen(true);
  };
  const handleActiveCampaign = () => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/get-active-campaign`,
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
    };
    axios.request(config)
      .then((response) => {
        setActiveCampaign(response.data.campaign_published);

        //console.log(response.data);
        setIsLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false); // Set loading to false even on error
      });

  }
  useEffect(() => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/get-dashboard`,
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
    };

    axios.request(config)
      .then((response) => {
        setData(response.data);

        // console.log(response.data);
        setIsLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false); // Set loading to false even on error
      });
  }, []);

   const handleDeleteAccount = () => {
      setIsDelete(true);
      const config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `${baseUrl}/api/delete-user`,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
      };
  
      axios
        .request(config)
        .then((response) => {
          setIsDelete(false);
  
          toast({
            title: "Hesap",
            description: "Hesap başarıyla silindi.",
          });
  
          localStorage.clear();
          navigate("/signin");
        })
        .catch((error) => {
          setIsDelete(false);
          toast({
            title: "Hata",
            description: "Hesap silinemedi. Lütfen tekrar deneyin.",
            variant: "destructive",
          });
          console.error(error);
        });
    };

  useEffect(() => {
    handleActiveCampaign()
    const handleUserUpdate = () => {
      setBrandInfo(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("user", handleUserUpdate);

    // Initial load
    handleUserUpdate();

    return () => {
      window.removeEventListener("user", handleUserUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
      <DashboardNavbar />

      {/* Main Content */}
      <main className="flex-1 p-6 pb-36 md:p-8 md:pb-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Profilim</h2>

          {/* Profile and Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Profile Card */}
            <Card className="md:col-span-1">
              <CardContent className="p-6 flex flex-col items-center">
                {isLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <div className="w-40 h-40 bg-gray-300 rounded-full mb-4 relative overflow-hidden">
                      <img
                        src={brandInfo?.image ? imageUrl + '/' + brandInfo?.image : 'https://placehold.co/400x400'}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      {/* <button
                        className="absolute bottom-1 right-1 bg-black text-white p-1 rounded-full"
                        onClick={() => setProfilePictureDialogOpen(true)}
                      >
                        <Edit size={18} />
                      </button> */}
                    </div>
                    <h3 className="font-semibold text-base mb-1 text-center">{brandInfo?.name}</h3>
                    <div className="w-full space-y-3 mt-2">
                      <div className="flex items-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {brandInfo?.contact}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {brandInfo?.email}
                      </div>
                    </div>
                    <div className="mt-6 border-t border-gray-200 pt-4 w-full">
                      <p className="text-sm text-gray-600 mb-4">{brandInfo?.about}</p>
                      <div className="flex items-center">
                        <div>
                          <p className="text-sm font-medium">{brandInfo?.name}</p>
                          <p className="text-xs text-gray-500">Erfluencer Marka Yönetici</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="mt-4 w-full flex items-center gap-2 border-gray-300"
                      onClick={() => setProfileDialogOpen(true)}
                    >
                      <Edit size={16} />
                      Profili Düzenle
                    </Button>

                     <Button
                      variant="outline"
                      className="mt-4 w-full flex items-center gap-2 border-gray-300"
                       onClick={() => setShowDeleteConfirm(true)}
                       disabled={isDelete}
                    >
                      <Trash size={16} />
                      {isDelete ? "Hesabı Sil..." : "Hesabı Sil"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

          

            {/* Stats Cards */}
            <div className="md:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Influencers */}
                <Card className="h-full">
                  <CardContent className="p-6">
                    {isLoading ? (
                      <StatsSkeleton />
                    ) : (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">Toplam Katılımcı Sayısı Etkileyici</h3>
                          <div className="p-2 bg-red-100 text-red-500 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                              <line x1="12" y1="19" x2="12" y2="22"></line>
                            </svg>
                          </div>
                        </div>
                        <p className="text-3xl font-bold text-center">{data.total_influencer}</p>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Total Campaigns */}
                <Card className="h-full">
                  <CardContent className="p-6">
                    {isLoading ? (
                      <StatsSkeleton />
                    ) : (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-medium">Oluşturulan Toplam Kampanya</h3>
                          <div className="p-2 bg-purple-100 text-purple-500 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="current Donovan" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                          </div>
                        </div>
                        <p className="text-3xl font-bold text-center">{data.campaign_count}</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Potansiyel Erişim */}
                <Card className="h-full">
                  <CardContent className="p-3">
                    {isLoading ? (
                      <StatsSkeleton />
                    ) : (
                      <>
                        <h3 className="text-xs font-medium mb-1">Instagram Potansiyel Erişimi</h3>
                        <div className="flex items-center">
                          <Users size={16} className="text-blue-500 mr-2" />
                          <span className="text-lg font-bold">{data.potential_reach}</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Actual Reach */}
                {/* <Card className="h-full">
                  <CardContent className="p-3">
                    {isLoading ? (
                      <StatsSkeleton />
                    ) : (
                      <>
                        <h3 className="text-xs font-medium mb-1">Actual Reach</h3>
                        <div className="flex items-center">
                          <Eye size={16} className="text-pink-500 mr-2" />
                          <span className="text-lg font-bold">0</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card> */}

                {/* Toplam Etkileşim */}
                <Card className="h-full">
                  <CardContent className="p-3">
                    {isLoading ? (
                      <StatsSkeleton />
                    ) : (
                      <>
                        <h3 className="text-xs font-medium mb-1">Instagram Toplam Etkileşim</h3>
                        <div className="flex items-center">
                          <div className="text-red-500 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          </div>
                          <span className="text-lg font-bold">{data.total_engagement}</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Etkileşim Oranı */}
                <Card className="h-full">
                  <CardContent className="p-3">
                    {isLoading ? (
                      <StatsSkeleton />
                    ) : (
                      <>
                        <h3 className="text-xs font-medium mb-1">Instagram Etkileşim Oranı</h3>
                        <div className="flex items-center">
                          <Heart size={16} className="text-red-500 mr-2" />
                          <span className="text-lg font-bold">{data.engagement}%</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Potential Revenue */}
                {/* <Card className="h-full">
                  <CardContent className="p-3">
                    {isLoading ? (
                      <StatsSkeleton />
                    ) : (
                      <>
                        <h3 className="text-xs font-medium mb-1">Potential Revenue</h3>
                        <div className="flex items-center">
                          <DollarSign size={16} className="text-yellow-500 mr-2" />
                          <span className="text-lg font-bold">$0</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card> */}
              </div>


              {/* tiktok */}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Potansiyel Erişim */}
                <Card className="h-full">
                  <CardContent className="p-3">
                    {isLoading ? (
                      <StatsSkeleton />
                    ) : (
                      <>
                        <h3 className="text-xs font-medium mb-1">TikTok Potansiyel Erişimi </h3>
                        <div className="flex items-center">
                          <Users size={16} className="text-blue-500 mr-2" />
                          <span className="text-lg font-bold">{data.potential_reach_tiktok}</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Actual Reach */}
                {/* <Card className="h-full">
                  <CardContent className="p-3">
                    {isLoading ? (
                      <StatsSkeleton />
                    ) : (
                      <>
                        <h3 className="text-xs font-medium mb-1">Actual Reach</h3>
                        <div className="flex items-center">
                          <Eye size={16} className="text-pink-500 mr-2" />
                          <span className="text-lg font-bold">0</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card> */}

                {/* Toplam Etkileşim */}
                <Card className="h-full">
                  <CardContent className="p-3">
                    {isLoading ? (
                      <StatsSkeleton />
                    ) : (
                      <>
                        <h3 className="text-xs font-medium mb-1">TikTok Toplam Etkileşim</h3>
                        <div className="flex items-center">
                          <div className="text-red-500 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          </div>
                          <span className="text-lg font-bold">{data.total_engagement_tiktok}</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Etkileşim Oranı */}
                <Card className="h-full">
                  <CardContent className="p-3">
                    {isLoading ? (
                      <StatsSkeleton />
                    ) : (
                      <>
                        <h3 className="text-xs font-medium mb-1">TikTok Etkileşim Oranı</h3>
                        <div className="flex items-center">
                          <Heart size={16} className="text-red-500 mr-2" />
                          <span className="text-lg font-bold">{data.tiktok_engagement}%</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Potential Revenue */}
                {/* <Card className="h-full">
                  <CardContent className="p-3">
                    {isLoading ? (
                      <StatsSkeleton />
                    ) : (
                      <>
                        <h3 className="text-xs font-medium mb-1">Potential Revenue</h3>
                        <div className="flex items-center">
                          <DollarSign size={16} className="text-yellow-500 mr-2" />
                          <span className="text-lg font-bold">$0</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card> */}
              </div>

              <div className="flex justify-between items-center mb-4 ">
                <h3 className="text-lg font-medium">Toplam Aktif Kampanya</h3>
              </div>


              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 sm:gap-4">


                {activeCampaign && activeCampaign.length > 0 ? (activeCampaign.map((campaign, key) => (
                  <Link key={key} to={`/show-influencer/${campaign.id}`} className="block h-full">
                    <Card className="h-full overflow-hidden">
                      <div  >
                        <div className="relative h-32 overflow-hidden sm:h-40 lg:h-48">
                          <img
                            src={`${imageUrl}/${campaign.image}`}
                            alt={campaign.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-white text-xs font-medium px-2 py-1 rounded">
                            {campaign.type}
                          </div>
                        </div>

                        <div className="min-w-0 p-2.5 sm:p-3">
                          <h3 className="break-words text-sm font-medium leading-tight sm:text-base">{campaign.name}</h3>
                          <p className="mb-2 break-words text-xs leading-snug text-gray-600 sm:text-sm">{campaign.company_name}</p>

                          <div className="mb-2 flex flex-col items-start gap-1.5 text-[11px] leading-snug text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:text-xs">
                            <div>tarihe göre katıl</div>
                            {campaign.start_date && <div className="max-w-full break-all rounded bg-gray-100 px-2 py-0.5 text-[10px] sm:text-xs">{campaign.start_date}</div>}
                          </div>

                          <div className="flex justify-between items-center">
                            {/* <button className="text-gray-400 hover:text-red-500" onClick={(e) => e.preventDefault()}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button> */}
                            <div className="flex items-center text-xs text-blue-500 sm:text-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {campaign.count + '/' + 10}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16">
                    <p className="text-gray-600 font-medium">Veri Yok</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

                {showDeleteConfirm && (
                  <div className="fixed inset-0 z-[9999] flex items-center justify-center  px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                      <h3 className="text-xl font-bold text-gray-900">
                        Hesabı silmek istediğinize emin misiniz?
                      </h3>
            
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        Bu işlem geri alınamaz. Hesabınız ve ilgili verileriniz kalıcı
                        olarak silinecektir.
                      </p>
            
                      <div className="mt-6 flex justify-end gap-3">
                        <Button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="bg-gray-100 text-gray-900 hover:bg-gray-200"
                          disabled={isDelete}
                        >
                          Vazgeç
                        </Button>
            
                        <Button
                          type="button"
                          onClick={handleDeleteAccount}
                          className="bg-red-600 text-white hover:bg-red-700"
                          disabled={isDelete}
                        >
                          {isDelete ? "Hesap siliniyor..." : "Evet, Sil"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

      </main>

      <Footer />

      {/* Profile Dialog */}
      <ProfileDialog
        open={profileDialogOpen}
        onOpenChange={setProfileDialogOpen}
      />

      {/* Profile Picture Dialog */}
      <ProfilePictureDialog
        open={profilePictureDialogOpen}
        onOpenChange={setProfilePictureDialogOpen}
      />

      {/* Campaign Form Dialog */}
      {campaignType && (
        <CampaignForm
          campaignType={campaignType}
          onClose={() => {
            setCampaignFormOpen(false);
            setCampaignType('');
          }}
          open={campaignFormOpen}
        />
      )}
    </div>
  );
};

export default Dashboard;
