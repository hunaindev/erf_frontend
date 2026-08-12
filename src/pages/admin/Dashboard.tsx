
import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, Building2, Megaphone, DollarSign, TrendingUp, Filter, Activity, Eye, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { baseUrl, imageUrl } from '@/utils/constants';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Play, CheckCircle, AlertCircle, MoreHorizontal, Download, FileDown, ExternalLink } from 'lucide-react';

import { toast } from 'sonner';
import { exportToCSV, exportToPDF } from '../../utils/tableExport';

const revenueData = [
  { month: 'Jan', revenue: 12000, users: 150 },
  { month: 'Feb', revenue: 15000, users: 180 },
  { month: 'Mar', revenue: 18000, users: 220 },
  { month: 'Apr', revenue: 22000, users: 280 },
  { month: 'May', revenue: 25000, users: 320 },
  { month: 'Jun', revenue: 28000, users: 380 },
];

const campaignData = [
  { name: 'Active', value: 45, color: '#10b981' },
  { name: 'Pending', value: 23, color: '#f59e0b' },
  { name: 'Completed', value: 132, color: '#cc53ec' },
  { name: 'Suspended', value: 8, color: '#ef4444' },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#cc53ec",
  },
  users: {
    label: "New Kullanıcılar",
    color: "#dc2626",
  },
};



const AdminDashboard = () => {


  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Published':
        return <Badge className="bg-green-100 text-green-700"><Play className="h-3 w-3 mr-1" />Aktif</Badge>;
      case 'Draft':
        return <Badge className="bg-gray-100 text-gray-700">Taslak</Badge>;
      case 'Closed':
        return <Badge className="bg-blue-100 text-blue-700"><CheckCircle className="h-3 w-3 mr-1" />Tamamlandı</Badge>;
      default:
        return ''
    }
  };
  const getFollowersBadge = (followers: string) => {
    const numFollowers = parseInt(followers.replace('K', '000'));
    if (numFollowers >= 100000) {
      return <span className="text-red-600 font-semibold">{followers === "undefined" || followers == null ? 0 : followers}</span>;
    } else if (numFollowers >= 50000) {
      return <span className="text-orange-600 font-semibold">{followers === "undefined" || followers == null ? 0 : followers}</span>;
    } else if (numFollowers >= 25000) {
      return <span className="text-blue-600 font-semibold">{followers === "undefined" || followers == null ? 0 : followers}</span>;
    } else {
      return <span className="text-green-600 font-semibold">{followers === "undefined" || followers == null ? 0 : followers}</span>;
    }
  };

  function getDashboard() {
    return axios.get(`${baseUrl}/api/get-dashboard-admin`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        'Content-Type': 'application/json',
      },
    }).then(res => res.data);
  }

  const {
    data: dashboard,
    isLoading: isLoading,
    isError: isError,
    error: Error,
  } = useQuery({
    queryKey: ['get-dashboard'],
    queryFn: getDashboard,
  });



  function fetchInfluencers() {
    return axios.get(`${baseUrl}/api/get-all-influencer`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        'Content-Type': 'application/json'
      }
    }).then(res => res.data.data);
  }

  const {
    data: data,
    isLoading: isAllLoading,
    isError: isAllError,
    error: allError,
  } = useQuery({
    queryKey: ['all-influencer'],
    queryFn: fetchInfluencers,

  });
  const influencer = Array.isArray(data)
    ? [...data]
      .sort((a, b) => b.id - a.id) // ya new Date(b.created_at) - new Date(a.created_at)
      .slice(0, 3)
    : [];

  function fetchBrand() {
    return axios.get(`${baseUrl}/api/get-all-brand`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        'Content-Type': 'application/json'
      }
    }).then(res => res.data.data);
  }

  const {
    data: allMarkalar,
    isLoading: isBrandLoading,
    isError: isBrandError,
    error: brandError,
  } = useQuery({
    queryKey: ['all-brand'],
    queryFn: fetchBrand,

  });
  const brands = Array.isArray(allMarkalar)
    ? [...allMarkalar]
      .sort((a, b) => b.id - a.id) // ya new Date(b.created_at) - new Date(a.created_at)
      .slice(0, 3)
    : [];

  function fetchAllCampaign() {
    return axios.get(`${baseUrl}/api/get-all-campaign`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        'Content-Type': 'application/json'
      }
    }).then(res => res.data.data);
  }

  const {
    data: allCampaign,
    isLoading: isCampaigLoading,
    isError: isCampaigError,
    error: campaigError,
  } = useQuery({
    queryKey: ['all-campaign'],
    queryFn: fetchAllCampaign,
  });

  const campaigns = Array.isArray(allCampaign)
    ? [...allCampaign]
      .sort((a, b) => b.id - a.id) // ya new Date(b.created_at) - new Date(a.created_at)
      .slice(0, 5)
    : [];
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Yönetici Kontrol Paneli</h1>
          <p className="text-gray-600 mt-2">Platform istatistikleri ve performans ozeti</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$125,430</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif Kampanyalar</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard?.campaign}</div>
              <p className="text-xs text-muted-foreground">
                {/* <span className="text-green-600">+8</span> new this week */}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Kullanici</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard?.user}</div>
              <p className="text-xs text-muted-foreground">
                {/* <span className="text-green-600">+23</span> new users today */}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif Markalar</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard?.brand}</div>
              <p className="text-xs text-muted-foreground">
                {/* <span className="text-green-600">+5</span> new this month */}
              </p>
            </CardContent>
          </Card>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {/* Filters and Search */}
          <Card className="filters-section">
            <CardHeader>
              <CardTitle>Tüm Influencerlar</CardTitle>
            </CardHeader>
            <CardContent>

              {/* Influencers Table */}
              <div className="table-container">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Influencer</TableHead>
                      <TableHead>Takipçiler
                      </TableHead>
                      <TableHead>Etkilesim</TableHead>
                      <TableHead>Kampanyalar</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Islemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {influencer && influencer?.length > 0 ? (
                      influencer?.map((influencer: any) => (
                        <TableRow key={influencer.id} className="table-row">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={influencer?.details?.profile_picture_url
                                  ? influencer?.details?.profile_picture_url : 'https://placehold.co/400x400'}
                                alt={influencer.name}
                                className="h-10 w-10 rounded-full"
                              />
                              <div>
                                <div className="font-medium">{influencer.name}</div>
                                <div className="text-sm text-gray-500">{influencer.insta_username}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getFollowersBadge(String(influencer?.details?.followers_count))}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{influencer?.details?.engagement ?? 0}</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{influencer.campaign}</span>
                          </TableCell>

                          <TableCell>{influencer.status == true ? <Badge className="bg-green-100 text-green-700">Aktif</Badge> : <Badge className="bg-red-100 text-red-700">Askida</Badge>}</TableCell>
                          <TableCell>




                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedInfluencer(influencer)}
                              className="view-button ml-2"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Görüntüle
                            </Button>


                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        {!(isAllLoading) && (
                          <TableCell colSpan={6} align="center">
                            <b>Influencer bulunamadı.</b>
                          </TableCell>
                        )}
                        {(isAllLoading) && (

                          <TableCell colSpan={6} align="center">
                            <b>Yükleniyor...</b>
                          </TableCell>

                        )}
                      </TableRow>
                    )}

                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>


          {/* Filters and Search */}
          <Card className="filters-section" >
            <CardHeader>
              <CardTitle>Tüm Markalar</CardTitle>
            </CardHeader>
            <CardContent>

              {/* Markalar Table */}
              <div className="table-container">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Marka</TableHead>
                      <TableHead>Aktif Kampanyalar</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Islemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brands && brands?.length > 0 ? (
                      brands?.map((brand: any) => (

                        <TableRow key={brand.id} className="table-row">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={brand?.image ? `${imageUrl}/${brand?.image}` : 'https://placehold.co/400x400'}

                                alt={brand?.name}
                                className="h-10 w-10 rounded-full"
                              />

                              <div>
                                <div className="font-medium">{brand?.name}</div>
                                <div className="text-sm text-gray-500">{brand?.username}</div>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <span className="font-medium">{brand.campaign}</span>
                          </TableCell>

                          <TableCell>{brand.status == true ? <Badge className="bg-green-100 text-green-700">Aktif</Badge> : <Badge className="bg-red-100 text-red-700">Askida</Badge>}</TableCell>

                          <TableCell>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedBrand(brand)}
                              className="view-button ml-2"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Görüntüle
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        {!(isBrandLoading) && (
                          <TableCell colSpan={5} align="center">
                            <b>Marka bulunamadı.</b>
                          </TableCell>
                        )}
                        {(isBrandLoading) && (

                          <TableCell colSpan={5} align="center">
                            <b>Yükleniyor...</b>
                          </TableCell>

                        )}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card >





        </div>



        {/* Filters and Search */}
        <Card className="filters-section">
          <CardHeader>
            <CardTitle>Tum Kampanyalar</CardTitle>
          </CardHeader>
          <CardContent>


            {/* Campaigns Table */}
            <div className="table-container">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kampanya</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Influencerlar</TableHead>

                    <TableHead>Sure</TableHead>
                    <TableHead>Islemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns && campaigns?.length > 0 ? (
                    campaigns?.map((campaign: any) => (
                      <TableRow key={campaign.id} className="table-row">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={campaign?.image ? campaign?.image : 'https://placehold.co/400x400'} />
                              <AvatarFallback>{campaign?.brand ? campaign?.brand.slice(0, 2) : ''}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{campaign?.name}</div>
                              <div className="text-sm text-gray-600">{campaign?.brand}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(campaign?.status)}</TableCell>
                        <TableCell>
                          <div className="font-medium">{campaign?.influencer}</div>
                        </TableCell>


                        <TableCell>
                          <div className="text-sm">
                            <div>{campaign?.start_date}</div>
                            <div className="text-gray-600">ile {campaign?.end_date}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/campaign-details/${campaign.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Detayları Görüntüle
                                </Link>
                              </DropdownMenuItem>
                              {campaign.status === 'Draft' && (
                                <DropdownMenuItem className="text-gray-600">
                                  Taslak Kampanya
                                </DropdownMenuItem>
                              )}
                              {campaign.status === 'Published' && (
                                <DropdownMenuItem className="text-green-600">
                                  Aktif Kampanya
                                </DropdownMenuItem>
                              )}
                              {campaign.status === 'Closed' && (
                                <DropdownMenuItem className="text-blue-600">
                                  Kampanyayi Tamamla
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      {!(isCampaigLoading) && (
                        <TableCell colSpan={5} align="center">
                          <b>Kampanya bulunamadı.</b>
                        </TableCell>
                      )}
                      {(isCampaigLoading) && (

                        <TableCell colSpan={5} align="center">
                          <b>Yükleniyor...</b>
                        </TableCell>

                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>










        {/* Brand Details Dialog */}
        <Dialog open={!!selectedBrand} onOpenChange={() => setSelectedBrand(null)}>
          <DialogContent className="dialog-content">
            <DialogHeader className="dialog-header">
              <DialogTitle className="dialog-title">Marka Detayları</DialogTitle>
            </DialogHeader>
            {selectedBrand && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedBrand?.image ? `${imageUrl}/${selectedBrand?.image}` : 'https://placehold.co/400x400'}

                    alt={selectedBrand?.name}
                    className="h-10 w-10 rounded-full"
                  />

                  <div>
                    <h3 className="font-bold text-lg">{selectedBrand?.name}</h3>
                    <p className="text-gray-600">{selectedBrand?.email}</p>
                    <a href={selectedBrand?.company_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      {selectedBrand?.company_url}
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">İletişim Kişisi</label>
                    <div className="mt-1 font-medium">{selectedBrand?.username}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Telefon</label>
                    <div className="mt-1 font-medium">{selectedBrand?.phone}</div>
                  </div>
                  {/* <div>
                    <label className="text-sm font-medium text-gray-600">Kategori</label>
                    <div className="mt-1">{selectedBrand.category}</div>
                  </div> */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Katılım Tarihi</label>
                    <div className="mt-1 font-medium">{new Date(selectedBrand.created_at).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Aktif Kampanyalar</label>
                    <div className="mt-1 font-medium">{selectedBrand.campaign}</div>
                  </div>
                  {/* <div>
                    <label className="text-sm font-medium text-gray-600">Toplam Harcama</label>
                    <div className="mt-1 font-medium text-green-600">{selectedBrand.totalSpent}</div>
                  </div> */}
                  {/* <div>
                    <label className="text-sm font-medium text-gray-600">Deneme Durumu</label>
                    <div className="mt-1">{getTrialBadge(selectedBrand.trialStatus, selectedBrand.trialDaysLeft)}</div>
                  </div> */}
                  {/* <div>
                    <label className="text-sm font-medium text-gray-600">Abonelik Plani</label>
                    <div className="mt-1 font-medium">{selectedBrand.subscriptionPlan}</div>
                  </div> */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Durum</label>
                    <div className="mt-1">{selectedBrand.status == true ? <Badge className="bg-green-100 text-green-700">Aktif</Badge> : <Badge className="bg-red-100 text-red-700">Askida</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog >

        {/* Influencer Details Dialog */}
        <Dialog open={!!selectedInfluencer} onOpenChange={() => setSelectedInfluencer(null)} >
          <DialogContent className="dialog-content max-h-[90vh] overflow-y-auto">
            <DialogHeader className="dialog-header">
              <DialogTitle className="dialog-title">Influencer Detaylari</DialogTitle>
            </DialogHeader>
            {selectedInfluencer && (
              <div className="space-y-6">
                <h6 className="font-bold">Instagram</h6>
                <div className="flex items-center gap-4">

                  <img
                    src={selectedInfluencer?.details?.profile_picture_url
                      ? selectedInfluencer?.details?.profile_picture_url : 'https://placehold.co/400x400'}
                    alt={selectedInfluencer.name}
                    className="h-16 w-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{selectedInfluencer?.name}</h3>
                    <p className="text-gray-600">{selectedInfluencer?.insta_username}</p>
                    <p className="text-sm text-gray-500">{selectedInfluencer?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">

                  {/* instagram */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Takipçiler
                    </label>
                    <div className="mt-1 font-medium text-lg">{selectedInfluencer?.details?.followers_count}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Etkilesim Orani</label>
                    <div className="mt-1 font-medium text-lg">{selectedInfluencer?.details?.engagement}</div>
                  </div>

                  {/* <div> */}
                  {/* <label className="text-sm font-medium text-gray-600">Seviye</label> */}
                  {/* <div className="mt-1">{getLevelBadge(selectedInfluencer.level)}</div> */}
                  {/* </div> */}
                </div>


                {/* tiktok */}
                <h6 className="font-bold">TikTok</h6>
                <div className="flex items-center gap-4">
                  <img
                    src={selectedInfluencer?.tiktok_details?.profile_picture_url
                      ? selectedInfluencer?.tiktok_details?.profile_picture_url : 'https://placehold.co/400x400'}
                    alt={selectedInfluencer.name}
                    className="h-16 w-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{selectedInfluencer?.name}</h3>
                    <p className="text-gray-600">{selectedInfluencer?.tiktok_details?.username}</p>
                    <p className="text-sm text-gray-500">{selectedInfluencer?.email}</p>
                  </div>
                </div>


                <div className="grid grid-cols-2 gap-4">


                  <div>
                    <label className="text-sm font-medium text-gray-600">Takipçiler
                    </label>
                    <div className="mt-1 font-medium text-lg">{selectedInfluencer?.tiktok_details?.followers_count ?? 0}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Etkilesim Orani</label>
                    <div className="mt-1 font-medium text-lg">{selectedInfluencer?.tiktok_details?.engagement ?? 0}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Kategori</label>
                    {data &&
                      selectedInfluencer.category.map((item: any) => (
                        <div className="mt-1 font-medium">{item}</div>
                      )
                      )
                    }
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Toplam Kampanya</label>
                    <div className="mt-1 font-medium">{selectedInfluencer.campaign}</div>
                  </div>


                  {/* <div>
                         <label className="text-sm font-medium text-gray-600">Toplam Kazanc</label>
                         <div className="mt-1 font-medium text-green-600">{selectedInfluencer.earnings}</div>
                       </div> */}
                  <div>
                    <label className="text-sm font-medium text-gray-600">Katılım Tarihi</label>
                    <div className="mt-1 font-medium">{new Date(selectedInfluencer.created_at).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Durum</label>
                    <div className="mt-1">{selectedInfluencer.status == true ? <Badge className="bg-green-100 text-green-700">Aktif</Badge> : <Badge className="bg-red-100 text-red-700">Askida</Badge>}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Telefon</label>
                    <div className="mt-1 font-medium">{selectedInfluencer.contact}</div>
                  </div>

                </div>
              </div>

            )}
          </DialogContent>
        </Dialog>













        {/* Charts */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & User Growth</CardTitle>
              <CardDescription>Aylık gelir ve yeni kullanici Kayıtlari</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="revenue" fill="#cc53ec" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kampanya Durum Dagilimi</CardTitle>
              <CardDescription>Tüm kampanyalarin duruma gore ozeti</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={campaignData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#cc53ec"
                      dataKey="value"
                    >
                      {campaignData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div> */}

        {/* Recent Activity & Quick Stats */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>En yeni platform aktiviteleri ve uyariar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-md">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New influencer registered</p>
                    <p className="text-xs text-gray-600">@sarah_lifestyle joined 2 minutes ago</p>
                  </div>
                  <Badge variant="secondary">New</Badge>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-md">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payment processed</p>
                    <p className="text-xs text-gray-600">Nike kampanyasindan 2,500$ odeme</p>
                  </div>
                  <Badge variant="secondary">Payment</Badge>
                </div>

                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-md">
                  <Activity className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Kampanya inceleme bekliyor</p>
                    <p className="text-xs text-gray-600">Adidas Summer Collection pending approval</p>
                  </div>
                  <Badge variant="outline">Review</Badge>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-md">
                  <Megaphone className="h-5 w-5 text-purple-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Kampanya başlatıldı</p>
                    <p className="text-xs text-gray-600">Tech Gadget Review kampanyasi simdi yayinda</p>
                  </div>
                  <Badge variant="secondary">Live</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Platform performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Conversion Rate</span>
                  <span className="text-sm font-medium">3.2%</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ort. Kampanya Degeri</span>
                  <span className="text-sm font-medium">$8,450</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Platform Uptime</span>
                  <span className="text-sm font-medium text-green-600">99.9%</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Support Tickets</span>
                  <span className="text-sm font-medium">12 open</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Premium Kullanıcılar</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
