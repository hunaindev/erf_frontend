import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Megaphone, Play, CheckCircle, AlertCircle, MoreHorizontal, Eye, Download, FileDown, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { exportToCSV, exportToPDF } from '../../utils/tableExport';
import { useQuery } from '@tanstack/react-query';
import { baseUrl, imageUrl } from '@/utils/constants';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const campaignsData = [
  {
    id: "CAM-001",
    title: "Summer Sports Collection",
    brand: "Nike",
    brandLogo: "/placeholder.svg",
    status: "active",
    influencersCount: 5,
    applicationsCount: 23,
    startDate: "2024-01-10",
    endDate: "2024-02-10",
    category: "Sports & Fitness",
    hashtags: ["#summervibes", "#sportswear", "#nike"],
    campaignImage: "/placeholder.svg",
    contentPieces: [
      {
        id: 1,
        influencer: "Sarah Johnson",
        type: "post",
        status: "approved",
        link: "https://instagram.com/p/sample1",
        preview: "/placeholder.svg"
      },
      {
        id: 2,
        influencer: "Sarah Johnson",
        type: "story",
        status: "pending",
        link: null,
        preview: "/placeholder.svg"
      }
    ]
  },
  {
    id: "CAM-002",
    title: "Marathon Gear",
    brand: "Adidas",
    brandLogo: "/placeholder.svg",
    status: "draft",
    influencersCount: 0,
    applicationsCount: 12,
    startDate: "2024-01-20",
    endDate: "2024-02-20",
    category: "Sports & Fitness",
    hashtags: ["#marathon", "#adidas", "#running"],
    campaignImage: "/placeholder.svg",
    contentPieces: []
  },
  {
    id: "CAM-003",
    title: "Winter Fashion",
    brand: "H&M",
    brandLogo: "/placeholder.svg",
    status: "completed",
    influencersCount: 8,
    applicationsCount: 45,
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    category: "Fashion",
    hashtags: ["#winter", "#fashion", "#hm"],
    campaignImage: "/placeholder.svg",
    contentPieces: []
  }
];

const AdminCampaigns = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState('');
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
  const queryClient = useQueryClient();

  const handleExport = (format: 'csv' | 'pdf') => {
    const exportData = filteredCampaigns.map(campaign => ({
      ID: campaign.id,
      Baslik: campaign.title,
      Marka: campaign.brand,
      Durum: campaign.status,
      Kategori: campaign.category,
      Influencerlar: campaign.influencersCount,
      Basvurular: campaign.applicationsCount,
      'Başlangıç Tarihi': campaign.startDate,
      'Bitiş Tarihi': campaign.endDate,
      Hashtags: campaign.hashtags.join(', ')
    }));

    if (format === 'csv') {
      exportToCSV(exportData, 'campaigns');
    } else {
      exportToPDF(exportData, 'campaigns', 'Kampanya Yönetim Raporu');
    }

    toast.success(`Kampanyalar disa aktarildi: ${format.toUpperCase()}`);
  };

  const handleViewContent = (campaign: any) => {
    setSelectedCampaign(campaign);
    setShowContentDialog(true);
  };

  const handleContentLink = (content: any) => {
    if (content.link) {
      window.open(content.link, '_blank');
    } else {
      toast.error("Content not yet uploaded to platform");
    }
  };

  const filteredCampaigns = campaignsData.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || campaign.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalCampaigns = campaignsData.length;
  const activeCampaigns = campaignsData.filter(c => c.status === 'active').length;
  const draftCampaigns = campaignsData.filter(c => c.status === 'draft').length;

  function fetchAllCampaignDash() {
    return axios.get(`${baseUrl}/api/get-all-campaign-dash`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        'Content-Type': 'application/json'
      }
    }).then(res => res.data);
  }

  const {
    data: campaignDash,
    isLoading: isLoading,
    isError: isError,
    error: Error,
  } = useQuery({
    queryKey: ['campaign-dash'],
    queryFn: fetchAllCampaignDash,

  });


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500); // Delay in ms (500ms = 0.5 second)

    return () => clearTimeout(timer);
  }, [searchTerm]);

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
    isLoading: isAllLoading,
    isError: isAllError,
    error: allError,
  } = useQuery({
    queryKey: ['all-campaign'],
    queryFn: fetchAllCampaign,
    enabled: !searchTerm // Only run when no search term
  });

  function searchAllCampaign() {
    return axios.get(`${baseUrl}/api/get-all-campaign?search=${searchTerm}`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        'Content-Type': 'application/json'
      }
    }).then(res => res.data.data);
  }
  const {
    data: searchedAllCampaign,
    isLoading: isSearchLoading,
    isError: isSearchError,
    error: searchError,
  } = useQuery({
    queryKey: ['search-all-campaign', searchTerm],
    queryFn: searchAllCampaign,
    enabled: !!debouncedTerm // Only run when searchTerm exists
  });
  const data = searchTerm ? searchedAllCampaign : allCampaign;

 // console.log(data);

 // function mein id pass karein
function disableCampaign(id) {
    return axios.get(`${baseUrl}/api/disable-campaign/${id}`, {
        headers: {
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            'Content-Type': 'application/json'
        }
    }).then(res => res.data);
}

  const mutation = useMutation({
        mutationFn: (id) => disableCampaign(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['all-campaign']);
           // alert("Campaign disabled successfully!");
        },
        onError: (error) => {
            console.error("Error disabling campaign:", error);
        }
    });

    const handleDisable = (id) => {
        mutation.mutate(id); // Yahan se ID pass hogi
    };

  return (
    <div className="admin-dashboard">
      <AdminNavbar />

      <div className="admin-content">
        <div className="admin-header">
          <h1>Kampanya Yönetimi</h1>
          <p>Tüm platform kampanyalarını izleyin ve yönetin</p>
        </div>

        {/* Campaign Stats */}
        <div className="stats-grid md-cols-2 lg-cols-4">
          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Kampanya</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaignDash?.total_campaign}</div>
              <p className="text-xs text-muted-foreground">Tüm kampanyalar</p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaignDash?.active_campaign}</div>
              <p className="text-xs text-muted-foreground">Su anda devam ediyor</p>
            </CardContent>
          </Card>

          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taslak</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{campaignDash?.draft_campaign}</div>
              <p className="text-xs text-muted-foreground">Hazirlaniyor</p>
            </CardContent>
          </Card>


          <Card className="stat-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tamamlandı</CardTitle>
              <Megaphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {campaignDash?.complete_campaign}
              </div>
              <p className="text-xs text-muted-foreground">Toplam basvuru</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="filters-section">
          <CardHeader>
            <CardTitle>Tum Kampanyalar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="filters-row md-flex-row">
              <div className="search-wrapper">
                <Search className="search-icon" />
                <Input
                  placeholder="Kampanyalari ara..."
                  className="search-input pl-5"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="filter-select">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="draft">Taslak</SelectItem>
                  <SelectItem value="completed">Tamamlandı</SelectItem>
                </SelectContent>
              </Select> */}

              {/* <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="filter-select">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  <SelectItem value="Sports & Fitness">Spor ve Fitness</SelectItem>
                  <SelectItem value="Technology">Teknoloji</SelectItem>
                  <SelectItem value="Entertainment">Eglence</SelectItem>
                  <SelectItem value="Fashion">Moda</SelectItem>
                  <SelectItem value="Food & Beverage">Yeme-Icme</SelectItem>
                </SelectContent>
              </Select> */}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="export-button">
                    <Download className="h-4 w-4 mr-2" />Disa Aktar</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    <FileDown className="h-4 w-4 mr-2" />
                    CSV olarak disa aktar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileDown className="h-4 w-4 mr-2" />
                    PDF olarak disa aktar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Campaigns Table */}
            <div className="table-container">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kampanya</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Influencerlar</TableHead>
                    {/* <TableHead>Applications</TableHead> */}
                    {/* <TableHead>İçerik</TableHead> */}
                    <TableHead>Sure</TableHead>
                    <TableHead>engelli</TableHead>
                    <TableHead>Islemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data && data.length > 0 ? (
                    data.map((campaign: any) => (
                      <TableRow key={campaign.id} className="table-row">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={campaign?.image ? imageUrl + '/' + campaign?.image : 'https:/ / placehold.co / 400x400'} />
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
                          <button  onClick={() => handleDisable(campaign?.id)} 
                                    disabled={mutation.isPending}>
    
                           <Badge className={`${campaign?.disable === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700' }`}>{campaign?.disable === 0 ? 'etkinleştirilmiş' : 'engelli'}</Badge>
                          </button>
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
                                  Kampanyayi Aktif Et
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
                      {!(isSearchLoading || isAllLoading) && (
                        <TableCell colSpan={5} align="center">
                          <b>Kampanya bulunamadı.</b>
                        </TableCell>
                      )}
                      {(isSearchLoading || isAllLoading) && (

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


      </div>
    </div >
  );
};

export default AdminCampaigns;
