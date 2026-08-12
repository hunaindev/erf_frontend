import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '@/components/DashboardNavbar';
import Footer from '@/components/Footer';
import CampaignForm from '@/components/CampaignForm';
import UpdateCampaignForm from '@/components/UpdateCampaignForm';
import DraftCampaignForm from '@/components/draft-campaign-form';
import axios from 'axios';
import { baseUrl, imageUrl } from '@/utils/constants';

// Shimmer Placeholder Component
const ShimmerCard = () => (
  <div className="border rounded-lg overflow-hidden animate-pulse">
    <div className="relative h-40 sm:h-48 bg-gray-200" />
    <div className="p-3 sm:p-4">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="flex justify-between items-center mb-2">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  </div>
);

const Campaigns = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [campaignFormOpen, setCampaignFormOpen] = useState(false);
  const [draftCampaignFormOpen, setDraftCampaignFormOpen] = useState(false);
  const [updateCampaignFormOpen, setUpdateCampaignFormOpen] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [updateCampaigns, setUpdateCampaigns] = useState([]);
  const [draftCampaigns, setDraftCampaigns] = useState([]);
  const [subscriptionDetails, setSubscriptionDetails] = useState([]);
  const [buttonState, setButtonState] = useState(false);
  const [launchDialogOpen, setLaunchDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [isLoading, setIsLoading] = useState(true); // New loading state





  const handleCampaignClick = () => {
    setCampaignFormOpen(true);
  };

  const handleDraftClick = (campaign) => {
    setDraftCampaigns(campaign);
    setDraftCampaignFormOpen(true);
  };

  const handleClick = (campaign) => {
    setUpdateCampaigns(campaign);
    setUpdateCampaignFormOpen(true);
  };

  const handleGetSubscription = async () => {
    setIsLoading(true); // Set loading true before fetching
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/get-paytr-row-subscription`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      withCredentials: true,
    };

    try {
      const response = await axios.request(config);
      setSubscriptionDetails(response.data.paytr);

      if (response.data?.message) {

        setButtonState(false);

      } else {
        setButtonState(true);
      }

    } catch (error) {
      console.error('Error fetching subscription details:', error);
    } finally {
      setIsLoading(false); // Set loading false after fetching
    }
  };

  const deleteModel = (id) => {
    setLaunchDialogOpen(true);
    setDeleteId(id);
  };


  const handleDeleteCampaign = async (id) => {
    setIsLoading(true); // Set loading true before deleting
    const config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/delete-campaign/${id}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      withCredentials: true,
    };

    try {
      await axios.request(config);
      await getCampaign();
      setLaunchDialogOpen(false);
    } catch (error) {
      console.error('Error deleting campaign:', error);
    } finally {
      setIsLoading(false); // Set loading false after deleting
    }
  };


  useEffect(() => {
    handleGetSubscription();
  }, []);

  const getCampaign = async () => {
    setIsLoading(true); // Set loading true before fetching campaigns
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/get-campaigns`,
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
    };

    try {
      const response = await axios.request(config);
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setIsLoading(false); // Set loading false after fetching
    }
  };

  const handleCampaignFormClose = () => {
  setCampaignFormOpen(false);
  getCampaign();
};

const handleUpdateCampaignFormClose = () => {
  setUpdateCampaignFormOpen(false);
  getCampaign();
};

const handleDraftCampaignFormClose = () => {
  setDraftCampaignFormOpen(false);
  getCampaign();
};

useEffect(() => {
  getCampaign();
}, []);

  // useEffect(() => {
  //   getCampaign();
  // }, [campaignFormOpen,updateCampaignFormOpen,draftCampaignFormOpen]);

  const EditIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      id="edit"
      width="24"
      height="24"
      fill="currentColor"
    >
      <path d="M3.5,24h15A3.51,3.51,0,0,0,22,20.487V12.95a1,1,0,0,0-2,0v7.537A1.508,1.508,0,0,1,18.5,22H3.5A1.508,1.508,0,0,1,2,20.487V5.513A1.508,1.508,0,0,1,3.5,4H11a1,1,0,0,0,0-2H3.5A3.51,3.51,0,0,0,0,5.513V20.487A3.51,3.51,0,0,0,3.5,24Z" />
      <path d="M9.455,10.544l-.789,3.614a1,1,0,0,0,.271.921,1.038,1.038,0,0,0,.92.269l3.606-.791a1,1,0,0,0,.494-.271l9.114-9.114a3,3,0,0,0,0-4.243,3.07,3.07,0,0,0-4.242,0l-9.1,9.123A1,1,0,0,0,9.455,10.544Zm10.788-8.2a1.022,1.022,0,0,1,1.414,0,1.009,1.009,0,0,1,0,1.413l-.707.707L19.536,3.05Zm-8.9,8.914,6.774-6.791,1.4,1.407-6.777,6.793-1.795.394Z" />
    </svg>
  );


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <style>
        {`
          .animate-pulse {
            animation: pulse 1.5s infinite;
          }
          @keyframes pulse {
            0% {
              background-color: #e5e7eb;
            }
            50% {
              background-color: #d1d5db;
            }
            100% {
              background-color: #e5e7eb;
            }
          }
        `}
      </style>
      <DashboardNavbar />
      <main className="flex-1 p-4 pb-44 sm:p-6 sm:pb-36 md:p-8 md:pb-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="sticky top-0 z-20 -mx-4 mb-6 border-b border-slate-100 bg-white/95 px-4 pb-4 pt-2 backdrop-blur-sm sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-0">
          <div className="mb-4 flex flex-col items-start gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl sm:text-2xl font-bold">Kampanyalar</h1>
            
            <Button
              className="bg-black hover:bg-gray-900 text-white flex items-center gap-2 w-full sm:w-auto"
              onClick={() => {
                if (buttonState) {
                  handleCampaignClick();
                } else {
                  navigate('/subscription');
                }
              }}
              disabled={isLoading}
            >
              <Plus size={16} />
              Kampanya Oluştur
            </Button>
          </div>

              <TabsList className="grid h-auto w-full grid-cols-3 border-b border-gray-200 bg-transparent p-0">
              <TabsTrigger
                value="draft"
                className="min-w-0 rounded-none border-b-2 border-transparent bg-transparent px-1 py-2 text-center text-[11px] font-medium leading-tight whitespace-normal text-gray-700 data-[state=active]:border-black data-[state=active]:text-black sm:px-2 sm:text-xs md:px-4 md:text-base"
              >
                Taslak Kampanyalar <span className="bg-orange-500 text-white rounded-full text-xs ml-1 px-1.5">{campaigns?.campaign_draft ? campaigns?.campaign_draft.length : '0'}</span>
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="min-w-0 rounded-none border-b-2 border-transparent bg-transparent px-1 py-2 text-center text-[11px] font-medium leading-tight whitespace-normal text-gray-700 data-[state=active]:border-black data-[state=active]:text-black sm:px-2 sm:text-xs md:px-4 md:text-base"
              >
                Aktif Kampanyalar <span className="bg-orange-500 text-white rounded-full text-xs ml-1 px-1.5">{campaigns?.campaign_published ? campaigns?.campaign_published.length : '0'}</span>
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="min-w-0 rounded-none border-b-2 border-transparent bg-transparent px-1 py-2 text-center text-[11px] font-medium leading-tight whitespace-normal text-gray-700 data-[state=active]:border-black data-[state=active]:text-black sm:px-2 sm:text-xs md:px-4 md:text-base"
              >
                Geçmis Kampanyalar<span className="bg-orange-500 text-white rounded-full text-xs ml-1 px-1.5">{campaigns?.campaign_closed ? campaigns?.campaign_closed.length : '0'}</span>
              </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="active" className="mt-0 pb-8 sm:pb-6 md:pb-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading ? (
                  Array(4)
                    .fill()
                    .map((_, index) => <ShimmerCard key={index} />)
                ) : campaigns?.campaign_published && campaigns?.campaign_published.length > 0 ? (
                  campaigns?.campaign_published.map((campaign, key) => (

                    <div key={key} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <Link to={`/show-influencer/${campaign.id}`}>
                        <div className="relative h-40 sm:h-48 overflow-hidden">
                          <img
                            src={`${imageUrl}/${campaign.image}`}

                            alt={campaign.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-white text-xs font-medium px-2 py-1 rounded">
                            {campaign.type}
                          </div>
                        </div>
                      </Link>
                      <div className="p-3 sm:p-4">
                        <h3 className="font-medium text-sm sm:text-base">{campaign.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2">{campaign.company_name}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                          <div>Katılım Tarihi</div>
                          {campaign.start_date && <div className="bg-gray-100 px-2 py-0.5 rounded">{campaign.start_date}</div>}
                        </div>
                        <div className="flex justify-between items-center">
                          <button
                            className="text-gray-400 hover:text-red-600"
                            onClick={() => handleClick(campaign)}
                            disabled={isLoading}
                          >
                            {EditIcon()}
                          </button>
                          <div className="flex items-center text-xs sm:text-sm text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {campaign.count + '/10'}
                          </div>
                        </div>
                      </div>
                    </div>

                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 col-span-full">
                    <p className="text-gray-600 font-medium">Veri Yok</p>
                  </div>
                )}
              </div>
              <div className="h-36 sm:hidden" />
            </TabsContent>

            <TabsContent value="past" className="mt-0 pb-8 sm:pb-6 md:pb-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading ? (
                  Array(4)
                    .fill()
                    .map((_, index) => <ShimmerCard key={index} />)
                ) : campaigns?.campaign_closed && campaigns?.campaign_closed.length > 0 ? (
                  campaigns?.campaign_closed.map((campaign, key) => (
                    <Link key={key} to={`/show-influencer/${campaign.id}`}>
                      <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="relative h-40 sm:h-48 overflow-hidden">
                          <img
                            src={`${imageUrl}/${campaign.image}`}

                            alt={campaign.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-white text-xs font-medium px-2 py-1 rounded">
                            {campaign.type}
                          </div>
                        </div>
                        <div className="p-3 sm:p-4">
                          <h3 className="font-medium text-sm sm:text-base">{campaign.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">{campaign.company_name}</p>
                          <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                            <div>Katılım Tarihi</div>
                            {campaign.start_date && <div className="bg-gray-100 px-2 py-0.5 rounded">{campaign.start_date}</div>}
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-xs sm:text-sm text-blue-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {campaign.count + '/10'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 col-span-full">
                    <p className="text-gray-600 font-medium">Veri Yok</p>
                  </div>
                )}
              </div>
              <div className="h-36 sm:hidden" />
            </TabsContent>

            <TabsContent value="draft" className="mt-0 pb-8 sm:pb-6 md:pb-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {isLoading ? (
                  Array(4)
                    .fill()
                    .map((_, index) => <ShimmerCard key={index} />)
                ) : campaigns?.campaign_draft && campaigns?.campaign_draft.length > 0 ? (
                  campaigns?.campaign_draft.map((campaign, key) => (
                    <div key={key} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-40 sm:h-48 overflow-hidden" onClick={() => handleDraftClick(campaign)}>
                        <img
                          src={campaign.image ? `${imageUrl}/${campaign.image}` : 'https://res.cloudinary.com/dqtjuqw51/image/upload/assets_task_01jxzbw9eyeprv0r9hsdtf2qb3_1750178151_img_0_wywdib.webp'}

                          alt={campaign.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-white text-xs font-medium px-2 py-1 rounded">
                          {campaign.type}
                        </div>
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="font-medium text-sm sm:text-base">{campaign.name}</h3>
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                          <div>Katılım Tarihi</div>

                        </div>
                        <div className="flex justify-between items-center">
                          <button
                            className="text-gray-400 hover:text-red-600"
                            onClick={() => deleteModel(campaign.id)}
                            disabled={isLoading}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
                            </svg>
                          </button>

                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 col-span-full">
                    <p className="text-gray-600 font-medium">Veri Yok</p>
                  </div>
                )}
              </div>
              <div className="h-36 sm:hidden" />
            </TabsContent>
          </Tabs>
        </div>
      </main >
      <Footer />
      {/* <CampaignForm
        onClose={() => setCampaignFormOpen(false)}
        open={campaignFormOpen}
      />
      <UpdateCampaignForm
        onClose={() => setUpdateCampaignFormOpen(false)}
        data={updateCampaigns}
        open={updateCampaignFormOpen}
      />
      <DraftCampaignForm
        onClose={() => setDraftCampaignFormOpen(false)}
        data={draftCampaigns}
        open={draftCampaignFormOpen}
      /> */}

      <CampaignForm
  onClose={handleCampaignFormClose}
  open={campaignFormOpen}
/>

<UpdateCampaignForm
  onClose={handleUpdateCampaignFormClose}
  data={updateCampaigns}
  open={updateCampaignFormOpen}
/>

<DraftCampaignForm
  onClose={handleDraftCampaignFormClose}
  data={draftCampaigns}
  open={draftCampaignFormOpen}
/>


      <Dialog open={launchDialogOpen} onOpenChange={setLaunchDialogOpen}>
        <DialogContent className="w-[90%] max-w-md">
          <DialogTitle className="text-center text-lg sm:text-xl">Kampanyanı Sil
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />
          <div className="py-4">
            <p className="text-center text-gray-600 text-sm sm:text-base">
              Bu kampanyayi silmek istediginize emin misiniz?
            </p>
          </div>
          <div className="flex justify-center mt-2">
            <Button
              onClick={() => handleDeleteCampaign(deleteId)}
              className="w-full max-w-xs bg-black hover:bg-gray-800 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Siliniyor...' : 'Kampanyanı Sil'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default Campaigns;
